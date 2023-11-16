# Importa los módulos y objetos necesarios
import os
from flask import jsonify, request
from datetime import timedelta
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies, get_jwt
from models import User,Categorias, Productos,MesesProduccion , Packagings   # Importa el modelo de usuario (ajusta el nombre según tu configuración)
from app import app, db, bcrypt, flash,redirect
from util import allowed_file  # Importa la función allowed_file desde util.py
from flask import send_from_directory



# ...

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verifica si el usuario ya existe en la base de datos
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'El usuario ya existe'}), 400

    # Crea un nuevo usuario y establece la contraseña utilizando el método set_password
    # Pasa también el argumento 'is_admin' a la inicialización del modelo como 'admin' si está presente, de lo contrario, 'user'
    new_user = User(username=username, password=password, is_admin=data.get('is_admin', 'admin'))

    # Guarda el nuevo usuario en la base de datos
    db.session.add(new_user)
    db.session.commit()

    # Genera un token de acceso con Flask-JWT-Extended
    access_token = create_access_token(identity={
        'id': new_user.id,  # Agrega el id del usuario recién registrado
        'username': username,
        'is_admin': new_user.is_admin
    }, expires_delta=timedelta(days=1))

    return jsonify({'message': 'Usuario registrado exitosamente', 'access_token': access_token}), 201  # Código 201 significa "Created"


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verifica las credenciales del usuario
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Credenciales inválidas'}), 401

    # Genera un token de acceso con Flask-JWT-Extended
    access_token = create_access_token(identity={
        'id': user.id,  # Agrega el id del usuario
        'username': username,
        'is_admin': user.is_admin
    }, expires_delta=timedelta(days=1))

    print("Token obtenido:", access_token)

    return jsonify(access_token=access_token)

@app.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()

        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404

        user_info = {
            'id': user.id,  # Agrega el id del usuario
            'username': user.username,
            'is_admin': user.is_admin,
        }

        return jsonify(user_info), 200
    except Exception as e:
        # Manejar la excepción y devolver una respuesta adecuada
        return jsonify({'message': 'Error interno del servidor'}), 500


# Ruta para obtener la información de los usuarios
@app.route('/users', methods=['GET'])
def get_users():
    # Obtén la lista de usuarios (en este ejemplo, devuelve todos los usuarios)
    users = User.query.all()

    # Serializa la información de los usuarios (devuelve solo id y username)
    serialized_users = [{'id': user.id, 'username': user.username} for user in users]
    return jsonify({'users': serialized_users})


# Ruta protegida que requiere autenticación
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)


# Logout (Cerrar sesión)
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Obtén la identidad del usuario actual
    current_user = get_jwt_identity()

    # Puedes realizar más acciones de logout aquí si es necesario

    # Elimina las cookies JWT para cerrar la sesión
    response = jsonify({'message': 'Logout exitoso'})
    unset_jwt_cookies(response)
    
    return response, 200



@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return "File uploaded successfully"  # Puedes personalizar este mensaje
    else:
        flash('Invalid file type')
        return redirect(request.url)



@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/upload_category', methods=['POST'])
@jwt_required()
def upload_category():
    # Obtén el usuario actual
    user_identity = get_jwt_identity()
    current_user = User.query.filter_by(username=user_identity['username'], is_admin=str(user_identity['is_admin'])).first()

    if not current_user:
        return jsonify({'message': 'Acceso no autorizado'}), 403

    if current_user.is_admin != 'admin':
        return jsonify({'message': 'Acceso no autorizado para usuarios no administradores'}), 403

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    nombreesp = request.form['nombreesp']
    nombreeng = request.form['nombreeng']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Aquí puedes guardar la categoría con la foto en tu base de datos en la tabla Categorias
        nueva_categoria = Categorias(nombreesp=nombreesp, nombreeng=nombreeng, foto=filename)
        db.session.add(nueva_categoria)
        db.session.commit()

        return jsonify({'message': 'Category uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400


@app.route('/categories', methods=['GET'])
def get_categories():
    categories = Categorias.query.all()  # Consulta todas las categorías en la base de datos
    category_list = []

    for category in categories:
        category_data = {
            'id': category.id,
            'nombreesp': category.nombreesp,
            'nombreeng': category.nombreeng,
            'foto': category.foto
        }
        category_list.append(category_data)

    return jsonify(categories=category_list)



@app.route('/categories/<int:category_id>/edit', methods=['PUT'])
def edit_category(category_id):
    # Busca la categoría por su ID en la base de datos
    category = Categorias.query.get(category_id)

    if category is not None:
        # Actualiza los campos de la categoría con los datos proporcionados en la solicitud
        if 'nombreesp' in request.form:
            category.nombreesp = request.form['nombreesp']
        if 'nombreeng' in request.form:
            category.nombreeng = request.form['nombreeng']

        # Verifica si se proporciona un nuevo archivo de imagen
        if 'file' in request.files:
            new_file = request.files['file']
            if new_file.filename != '' and allowed_file(new_file.filename):
                # Elimina la foto anterior del servidor
                if category.foto:
                    foto_path = os.path.join(app.config['UPLOAD_FOLDER'], category.foto)
                    if os.path.exists(foto_path):
                        os.remove(foto_path)

                # Guarda la nueva foto en el servidor y actualiza el nombre de archivo en la base de datos
                filename = secure_filename(new_file.filename)
                new_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                category.foto = filename

        # Guarda los cambios en la base de datos
        db.session.commit()
        return jsonify({'message': 'Categoría editada con éxito'}), 200
    else:
        return jsonify({'error': 'Categoría no encontrada'}), 404


# Ruta para borrar una categoría por su ID
@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    # Busca la categoría por su ID en la base de datos
    category = Categorias.query.get(category_id)

    if category is not None:
        try:
            # Elimina la foto asociada de la categoría del servidor
            if category.foto:
                foto_path = os.path.join(app.config['UPLOAD_FOLDER'], category.foto)
                if os.path.exists(foto_path):
                    os.remove(foto_path)

            # Elimina todos los productos asociados a la categoría
            productos_asociados = Productos.query.filter_by(categoria_id=category.id).all()
            for producto in productos_asociados:
                # Elimina la foto asociada del servidor
                if producto.foto:
                    foto_path = os.path.join(app.config['UPLOAD_FOLDER'], producto.foto)
                    if os.path.exists(foto_path):
                        os.remove(foto_path)

                # Elimina el producto de la base de datos
                db.session.delete(producto)

            # Elimina la categoría de la base de datos
            db.session.delete(category)

            db.session.commit()
            return jsonify({'message': 'Categoría, productos asociados y foto eliminados con éxito'}), 200
        except Exception as e:
            print(f"Error al eliminar categoría, productos asociados y foto: {str(e)}")
            db.session.rollback()
            return jsonify({'error': 'Error interno al eliminar categoría, productos asociados y foto'}), 500
    else:
        return jsonify({'error': 'Categoría no encontrada'}), 404

# Ruta para obtener todos los productos de una categoría
@app.route('/categorias/<int:categoria_id>/productos', methods=['GET'])
def get_productos_por_categoria(categoria_id):
    # Obtener la categoría
    categoria = Categorias.query.get(categoria_id)

    if categoria is None:
        return jsonify({'error': 'Categoría no encontrada'}), 404

    # Obtener los productos de la categoría
    productos = Productos.query.filter_by(categoria_id=categoria.id).all()

    # Crear una lista para almacenar la información de cada producto
    productos_info = []

    for producto in productos:
        # Agregar información relevante del producto a la lista
        producto_info = {
            'id': producto.id,
            'nombreesp': producto.nombreesp,
            'nombreeng': producto.nombreeng,
            'foto': producto.foto,
            # Puedes agregar más campos según tus necesidades
        }
        productos_info.append(producto_info)

    # Devolver la lista de productos en formato JSON
    return jsonify({'categoria': {'nombreesp': categoria.nombreesp, 'nombreeng': categoria.nombreeng}, 'productos': productos_info})

if __name__ == '__main__':
    app.run(debug=True)

# Ruta para crear un nuevo producto
@app.route('/upload_product', methods=['POST'])
def upload_product():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        nombreesp = request.form['nombreesp']
        nombreeng = request.form['nombreeng']
        descripcionesp = request.form['descripcionesp']
        descripcioneng = request.form['descripcioneng']
        categoria_id = request.form['categoria']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            nuevo_producto = Productos(
                nombreesp=nombreesp,
                nombreeng=nombreeng,
                descripcionesp=descripcionesp,
                descripcioneng=descripcioneng,
                categoria_id=categoria_id,
                foto=filename,
            )

            db.session.add(nuevo_producto)
            db.session.commit()

            return jsonify({'message': 'Product uploaded successfully'}), 200
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

# Ruta para ver todos los productos
@app.route('/productos', methods=['GET'])
def get_products():
    try:
        products = Productos.query.all()  # Consulta todos los productos en la base de datos
        product_list = []

        for product in products:
            # Consulta los packagings asociados a cada producto
            packagings = product.packagings  # Utiliza la relación packagings definida en el modelo Productos

            # Consulta los meses de producción asociados a cada producto
            meses = product.meses_produccion
            meses_de_produccion = [{'id': mes.id, 'mes': mes.mes} for mes in meses]

            # Crea una lista de datos de packaging asociados al producto
            packaging_list = []
            for packaging in packagings:
                users = [user.username for user in packaging.users]  # Accede a los usuarios asociados al packaging
                packaging_data = {
                    'id': packaging.id,
                    'nombreesp': packaging.nombreesp,
                    'nombreeng': packaging.nombreeng,
                    'presentacion': packaging.presentacion,
                    'peso_presentacion_g': packaging.peso_presentacion_g,
                    'peso_neto_kg': packaging.peso_neto_kg,
                    'tamano_caja': packaging.tamano_caja,
                    'pallet_80x120': packaging.pallet_80x120,
                    'peso_neto_pallet_80x120_kg': packaging.peso_neto_pallet_80x120_kg,
                    'pallet_100x120': packaging.pallet_100x120,
                    'peso_neto_pallet_100x120_kg': packaging.peso_neto_pallet_100x120_kg,
                    'foto': packaging.foto,
                    'producto_id': packaging.producto_id,
                    'users': users,  # Agrega la lista de usuarios al diccionario de packaging_data
                }
                packaging_list.append(packaging_data)

            # Crea un diccionario de datos del producto y sus packagings y meses de producción asociados
            product_data = {
                'id': product.id,
                'nombreesp': product.nombreesp,
                'nombreeng': product.nombreeng,
                'descripcionesp': product.descripcionesp,
                'descripcioneng': product.descripcioneng,
                'categoria_id': product.categoria_id,
                'foto': product.foto,
                'packagings': packaging_list,
                'meses_de_produccion': meses_de_produccion,
            }
            product_list.append(product_data)

        return jsonify(products=product_list), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500


# Ruta para obtener la información completa de un producto por su ID y categoría por su ID
@app.route('/categorias/<int:categoria_id>/productos/<int:producto_id>', methods=['GET'])
def get_product_info_by_category(categoria_id, producto_id):
    categoria = Categorias.query.get(categoria_id)

    if categoria:
        producto = Productos.query.filter_by(id=producto_id, categoria_id=categoria_id).first()

        if producto:
            # Obtener packagings del producto
            packagings = Packagings.query.filter_by(producto_id=producto_id).all()

            # Obtener meses de producción del producto
            meses_produccion = MesesProduccion.query.filter_by(producto_id=producto_id).all()

            # Crear un diccionario con la información del producto, packagings y meses de producción
            product_info = {
                "categoria": categoria.serialize(),
                "producto": producto.serialize(),
                "packagings": [packaging.serialize() for packaging in packagings],
                "meses_produccion": [mes.serialize() for mes in meses_produccion]
            }

            return jsonify(product_info)
        else:
            return jsonify({"error": "Producto no encontrado en la categoría especificada"}), 404
    else:
        return jsonify({"error": "Categoría no encontrada"}), 404

if __name__ == '__main__':
    app.run(debug=True)
# Ruta para eliminar un producto por su ID
@app.route('/productos/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    # Busca el producto por su ID en la base de datos
    product = Productos.query.get(product_id)

    if product is not None:
        # Elimina el producto de la base de datos
        db.session.delete(product)
        db.session.commit()

                # Elimina la foto asociada del servidor
        if product.foto:
            foto_path = os.path.join(app.config['UPLOAD_FOLDER'], product.foto)
            if os.path.exists(foto_path):
                os.remove(foto_path)


        return jsonify({'message': 'Producto eliminado con éxito'}), 200
    else:
        return jsonify({'error': 'Producto no encontrado'}), 404


# Ruta para editar un producto por su ID
@app.route('/productos/<int:product_id>/edit', methods=['PUT'])
def edit_product(product_id):
    # Busca el producto por su ID en la base de datos
    product = Productos.query.get(product_id)

    if product is not None:
        # Actualiza los campos del producto con los datos proporcionados en la solicitud
        if 'nombreesp' in request.form:
            product.nombreesp = request.form['nombreesp']
        if 'nombreeng' in request.form:
            product.nombreeng = request.form['nombreeng']
        if 'descripcionesp' in request.form:
            product.descripcionesp = request.form['descripcionesp']
        if 'descripcioneng' in request.form:
            product.descripcioneng = request.form['descripcioneng']
        if 'categoria_id' in request.form:
            product.categoria_id = request.form['categoria_id']

        # Verifica si se proporciona un nuevo archivo de imagen
        if 'file' in request.files:
            new_file = request.files['file']
            if new_file.filename != '' and allowed_file(new_file.filename):
                # Elimina la foto anterior del servidor
                if product.foto:
                    foto_path = os.path.join(app.config['UPLOAD_FOLDER'], product.foto)
                    if os.path.exists(foto_path):
                        os.remove(foto_path)

                # Guarda la nueva foto en el servidor y actualiza el nombre de archivo en la base de datos
                filename = secure_filename(new_file.filename)
                new_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                product.foto = filename

        # Guarda los cambios en la base de datos
        db.session.commit()

        return jsonify({'message': 'Producto editado con éxito'}), 200
    else:
        return jsonify({'error': 'Producto no encontrado'}), 404


# Ruta para obtener los meses de producción asociados a un producto
@app.route('/productos/<int:producto_id>/meses', methods=['GET'])
def obtener_meses_de_produccion(producto_id):
    try:
        producto = Productos.query.get(producto_id)
        meses = MesesProduccion.query.filter_by(producto_id=producto_id).all()

        meses_de_produccion = [{'id': mes.id, 'mes': mes.mes} for mes in meses]

        return jsonify(producto_id=producto_id, meses_de_produccion=meses_de_produccion), 200
    except Exception as e:
        print(f"Error al obtener los meses de producción del producto: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Ruta para agregar meses de producción a un producto
@app.route('/productos/<int:producto_id>/meses/agregar', methods=['POST'])
def agregar_meses_de_produccion(producto_id):
    try:
        data = request.get_json()
        nuevos_meses = data.get('meses', [])

        for nuevo_mes in nuevos_meses:
            # Verifica si el mes ya existe para el producto
            mes_existente = MesesProduccion.query.filter_by(mes=nuevo_mes, producto_id=producto_id).first()

            if not mes_existente:
                mes = MesesProduccion(mes=nuevo_mes, producto_id=producto_id)
                db.session.add(mes)

        db.session.commit()

        return jsonify({'message': 'Meses de producción agregados con éxito'}), 201
    except Exception as e:
        print(f"Error al agregar los meses de producción al producto: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500


# Ruta para eliminar un mes de producción de un producto por su ID
@app.route('/productos/<int:producto_id>/meses/eliminar/<int:mes_id>', methods=['DELETE'])
def eliminar_mes(producto_id, mes_id):
    mes = MesesProduccion.query.get(mes_id)

    if mes is not None and mes.producto_id == producto_id:
        db.session.delete(mes)
        db.session.commit()
        return jsonify({'message': 'Mes de producción eliminado con éxito'}), 200
    else:
        return jsonify({'error': 'Mes de producción no encontrado o no asociado al producto'}), 404




# Ruta para crear un nuevo packaging
@app.route('/upload_packaging', methods=['POST'])
def upload_packaging():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        nombreesp = request.form['nombreesp']
        nombreeng = request.form['nombreeng']
        presentacion = request.form['presentacion']
        calibre = request.form['calibre']
        peso_presentacion_g = request.form['peso_presentacion_g']
        peso_neto_kg = request.form['peso_neto_kg']
        tamano_caja = request.form['tamano_caja']
        pallet_80x120 = request.form['pallet_80x120']
        peso_neto_pallet_80x120_kg = request.form['peso_neto_pallet_80x120_kg']
        pallet_100x120 = request.form['pallet_100x120']
        peso_neto_pallet_100x120_kg = request.form['peso_neto_pallet_100x120_kg']
        foto = request.files['file']

        producto_id = request.form['producto_id']
        user_ids = request.form.getlist('user_ids')  # Cambiado de user_id a user_ids

        if foto and allowed_file(foto.filename):
            filename = secure_filename(foto.filename)
            foto.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            nuevo_packaging = Packagings(
                nombreesp=nombreesp,
                nombreeng=nombreeng,
                presentacion=presentacion,
                calibre=calibre,
                peso_presentacion_g=peso_presentacion_g,
                peso_neto_kg=peso_neto_kg,
                tamano_caja=tamano_caja,
                pallet_80x120=pallet_80x120,
                peso_neto_pallet_80x120_kg=peso_neto_pallet_80x120_kg,
                pallet_100x120=pallet_100x120,
                peso_neto_pallet_100x120_kg=peso_neto_pallet_100x120_kg,
                foto=filename,
                producto_id=producto_id
            )

            # Agrega nuevo_packaging a la sesión antes de operaciones relacionadas con la base de datos
            db.session.add(nuevo_packaging)
            db.session.commit()

            # Asigna los usuarios al packaging después de agregar a la sesión
            for user_id in user_ids:
                user = User.query.get(user_id)
                if user:
                    nuevo_packaging.users.append(user)

            # Realiza otro commit después de agregar usuarios
            db.session.commit()

        return jsonify({'message': 'Carga exitosa del embalaje'}), 200
    except Exception as e:
        # Registra el error en los registros del servidor
        print(f"Error en la carga del embalaje: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


# Ruta para obtener todos los packagings
@app.route('/packagings', methods=['GET'])
def get_packagings():
    try:
        packagings = Packagings.query.all()
        packaging_list = []

        for packaging in packagings:
            users = [{'id': user.id, 'username': user.username} for user in packaging.users]

            packaging_data = {
                'id': packaging.id,
                'nombreesp': packaging.nombreesp,
                'nombreeng': packaging.nombreeng,
                'presentacion': packaging.presentacion,
                'calibre': packaging.calibre,
                'peso_presentacion_g': packaging.peso_presentacion_g,
                'peso_neto_kg': packaging.peso_neto_kg,
                'tamano_caja': packaging.tamano_caja,
                'pallet_80x120': packaging.pallet_80x120,
                'peso_neto_pallet_80x120_kg': packaging.peso_neto_pallet_80x120_kg,
                'pallet_100x120': packaging.pallet_100x120,
                'peso_neto_pallet_100x120_kg': packaging.peso_neto_pallet_100x120_kg,
                'foto': packaging.foto,
                'producto_id': packaging.producto_id,
                'users': users,
            }

            packaging_list.append(packaging_data)

        return jsonify(packagings=packaging_list), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500
