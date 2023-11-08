
import os
from flask import Flask, flash, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


app = Flask(__name__)

# Configuración de la aplicación, como la base de datos, si la utilizas
app.config['JWT_SECRET_KEY'] = 'tu_clave_secreta_para_jwt'  # Cambia esto a una clave segura
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tu_base_de_datos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
# Configura CORS para permitir solicitudes solo desde un dominio específico
CORS(app)


# Importa las rutas después de definir las extensiones para evitar la importación circular
from routes import *

# Coloca db.create_all() dentro del contexto de la aplicación para crear las tablas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
