# Importa los módulos y objetos necesarios
import os
from flask import jsonify, request
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User,Categorias, Productos,MesesProduccion    # Importa el modelo de usuario (ajusta el nombre según tu configuración)
from app import app, db, bcrypt, flash,redirect
from util import allowed_file  # Importa la función allowed_file desde util.py
from flask import send_from_directory


# Registro de usuario
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')  # Asegúrate de que estás recibiendo el email del formulario

    # Verifica si el usuario ya existe en la base de datos (por ejemplo, busca por nombre de usuario)
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'El usuario ya existe'}), 400

    # Hashea la contraseña antes de guardarla en la base de datos
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Crea un nuevo usuario y guárdalo en la base de datos
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Usuario registrado con éxito'})


# Inicio de sesión y emisión de token JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verifica las credenciales del usuario
    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Credenciales inválidas'}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


# Ruta protegida que requiere autenticación
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)


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
def upload_category():
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

# Ruta para borrar una categoría por su ID
@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    # Busca la categoría por su ID en la base de datos
    category = Categorias.query.get(category_id)

    if category is not None:
        # Elimina la categoría de la base de datos
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Categoría eliminada con éxito'}), 200
    else:
        return jsonify({'error': 'Categoría no encontrada'}), 404


from flask import request, jsonify

# Ruta para crear un nuevo producto
@app.route('/upload_product', methods=['POST'])
def upload_product():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    nombreesp = request.form['nombreesp']
    nombreeng = request.form['nombreeng']
    descripcionesp = request.form['descripcionesp']
    descripcioneng = request.form['descripcioneng']
    categoria_id = request.form['categoria_id']

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

# Ruta para ver todos los productos
@app.route('/products', methods=['GET'])
def get_products():
    products = Productos.query.all()  # Consulta todos los productos en la base de datos
    product_list = []

    for product in products:
        product_data = {
            'id': product.id,
            'nombreesp': product.nombreesp,
            'nombreeng': product.nombreeng,
            'descripcionesp': product.descripcionesp,
            'descripcioneng': product.descripcioneng,
            'categoria_id': product.categoria_id,
            'foto': product.foto,
        }
        product_list.append(product_data)

    return jsonify(products=product_list)

# Ruta para eliminar un producto por su ID
@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    # Busca el producto por su ID en la base de datos
    product = Productos.query.get(product_id)

    if product is not None:
        # Elimina el producto de la base de datos
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Producto eliminado con éxito'}), 200
    else:
        return jsonify({'error': 'Producto no encontrado'}), 404

@app.route('/productos/<int:producto_id>/meses', methods=['GET'])
def ver_meses(producto_id):
    producto = Productos.query.get(producto_id)
    meses = MesesProduccion.query.filter_by(producto_id=producto_id).all()
    meses_de_produccion = []

    for mes in meses:
        meses_de_produccion.append({'id': mes.id, 'mes': mes.mes})

    return jsonify(producto_id=producto_id, meses_de_produccion=meses_de_produccion)

# Ruta para añadir un mes de producción a un producto
@app.route('/productos/<int:producto_id>/meses/agregar', methods=['POST'])
def agregar_mes(producto_id):
    data = request.get_json()
    mes = data.get('mes')

    app.logger.info(f'Solicitud POST recibida para agregar mes al producto ID {producto_id}')
    app.logger.info(f'Datos recibidos: {data}')

    if not mes or not isinstance(mes, str):
        app.logger.error('El campo mes debe ser una cadena y es requerido en los datos recibidos.')
        return jsonify({'error': 'El campo mes debe ser una cadena y es requerido'}), 400

    nuevo_mes = MesesProduccion(mes=mes, producto_id=producto_id)
    db.session.add(nuevo_mes)
    db.session.commit()

    return jsonify({'message': 'Mes de producción agregado con éxito'}), 200
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
