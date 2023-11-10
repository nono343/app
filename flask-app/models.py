from app import db  # Importa la instancia de SQLAlchemy desde tu aplicación


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<User {self.username}>'

class Categorias(db.Model):
    __tablename__ = 'categorias'  # Nombre de la tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    foto = db.Column(db.String(120), nullable=False)
    productos = db.relationship('Productos', backref='categoria', cascade='all, delete-orphan')


    def __init__(self, nombreesp, nombreeng, foto):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.foto = foto

    def __repr__(self):
        return f'<Categorias {self.nombreesp}>'

# Modelo para los productos

class Productos(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    descripcionesp = db.Column(db.Text, nullable=False)
    descripcioneng = db.Column(db.Text, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    foto = db.Column(db.String(120), nullable=False)
    meses_produccion = db.relationship('MesesProduccion', backref='producto', cascade='all, delete-orphan')
    packagings = db.relationship('Packagings', backref='producto', cascade='all, delete-orphan')

    def __init__(self, nombreesp, nombreeng, descripcionesp, descripcioneng, categoria_id, foto):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.descripcionesp = descripcionesp
        self.descripcioneng = descripcioneng
        self.categoria_id = categoria_id
        self.foto = foto

    def __repr__(self):
        return f'<Productos {self.nombreesp}>'

# Modelo para los meses del año

class MesesProduccion(db.Model):
    __tablename__ = 'meses_produccion'
    id = db.Column(db.Integer, primary_key=True)
    mes = db.Column(db.String(255), nullable=False)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id', name='fk_productos_meses_producto_id'))

    def __init__(self, mes, producto_id):
        self.mes = mes
        self.producto_id = producto_id

    def __repr__(self):
        return f'<MesesProduccion {self.mes}>'


class Packagings(db.Model):
    __tablename__ = 'packagings'
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    presentacion = db.Column(db.String(80), nullable=False)
    peso_presentacion_g = db.Column(db.String(80), nullable=False)
    peso_neto_kg = db.Column(db.String(80), nullable=False)
    tamano_caja = db.Column(db.String(80), nullable=False)
    pallet_80x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_80x120_kg = db.Column(db.String(80), nullable=False)
    pallet_100x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_100x120_kg = db.Column(db.String(80), nullable=False)
    foto = db.Column(db.String(120), nullable=False)  # Agrega esta línea para la foto
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id', name='fk_packagings_producto_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_packagings_user_id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('User', backref='packagings')

    def __init__(self, nombreesp, nombreeng, presentacion, peso_presentacion_g, peso_neto_kg,
                 tamano_caja, pallet_80x120, peso_neto_pallet_80x120_kg, pallet_100x120,
                 peso_neto_pallet_100x120_kg, foto, producto_id, user_id):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.presentacion = presentacion
        self.peso_presentacion_g = peso_presentacion_g
        self.peso_neto_kg = peso_neto_kg
        self.tamano_caja = tamano_caja
        self.pallet_80x120 = pallet_80x120
        self.peso_neto_pallet_80x120_kg = peso_neto_pallet_80x120_kg
        self.pallet_100x120 = pallet_100x120
        self.peso_neto_pallet_100x120_kg = peso_neto_pallet_100x120_kg
        self.foto = foto
        self.producto_id = producto_id
        self.user_id = user_id


    def __repr__(self):
        return f'<Packagings {self.nombreesp}>'
