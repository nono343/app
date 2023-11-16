from app import db, Bcrypt  # Asegúrate de importar db y Bcrypt desde tu aplicación

bcrypt = Bcrypt()

# Tabla de asociación para la relación many-to-many entre User y Packagings
user_packagings = db.Table(
    'user_packagings',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('packaging_id', db.Integer, db.ForeignKey('packagings.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.String(10), default='user')  # Cambiado a String

    # Relación many-to-many con Packagings
    packagings = db.relationship('Packagings', secondary=user_packagings, backref=db.backref('users', lazy='dynamic'))

    def __init__(self, username, password, is_admin=False):
        self.username = username
        self.is_admin = is_admin
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @property
    def role(self):
        return "Admin" if self.is_admin else "User"

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            # Otros campos si es necesario
        }

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

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'foto': self.foto,
            # Otros campos si es necesario
        }

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

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'descripcionesp': self.descripcionesp,
            'descripcioneng': self.descripcioneng,
            'categoria_id': self.categoria_id,
            'foto': self.foto,
            # Otros campos si es necesario
        }

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

    def serialize(self):
        return {
            'id': self.id,
            'mes': self.mes,
            'producto_id': self.producto_id,
            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<MesesProduccion {self.mes}>'


class Packagings(db.Model):
    __tablename__ = 'packagings'
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    presentacion = db.Column(db.String(80), nullable=False)
    calibre = db.Column(db.String(80), nullable=False)
    peso_presentacion_g = db.Column(db.String(80), nullable=False)
    peso_neto_kg = db.Column(db.String(80), nullable=False)
    tamano_caja = db.Column(db.String(80), nullable=False)
    pallet_80x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_80x120_kg = db.Column(db.String(80), nullable=False)
    pallet_100x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_100x120_kg = db.Column(db.String(80), nullable=False)
    foto = db.Column(db.String(120), nullable=False)  # Agrega esta línea para la foto
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id', name='fk_packagings_producto_id', ondelete='CASCADE'), nullable=False)

    def __init__(self, nombreesp, nombreeng, presentacion, calibre, peso_presentacion_g, peso_neto_kg,
                 tamano_caja, pallet_80x120, peso_neto_pallet_80x120_kg, pallet_100x120,
                 peso_neto_pallet_100x120_kg, foto, producto_id):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.presentacion = presentacion
        self.calibre = calibre
        self.peso_presentacion_g = peso_presentacion_g
        self.peso_neto_kg = peso_neto_kg
        self.tamano_caja = tamano_caja
        self.pallet_80x120 = pallet_80x120
        self.peso_neto_pallet_80x120_kg = peso_neto_pallet_80x120_kg
        self.pallet_100x120 = pallet_100x120
        self.peso_neto_pallet_100x120_kg = peso_neto_pallet_100x120_kg
        self.foto = foto
        self.producto_id = producto_id

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'presentacion': self.presentacion,
            'calibre': self.calibre,
            'peso_presentacion_g': self.peso_presentacion_g,
            'peso_neto_kg': self.peso_neto_kg,
            'tamano_caja': self.tamano_caja,
            'pallet_80x120': self.pallet_80x120,
            'peso_neto_pallet_80x120_kg': self.peso_neto_pallet_80x120_kg,
            'pallet_100x120': self.pallet_100x120,
            'peso_neto_pallet_100x120_kg': self.peso_neto_pallet_100x120_kg,
            'foto': self.foto,
            'producto_id': self.producto_id,
            'users': [user.serialize() for user in self.users],  # Agrega esta línea

            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<Packagings {self.nombreesp}>'
