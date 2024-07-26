import os
from os import path
from flask import Flask
from flask_login import LoginManager
from flask_admin import Admin
from flask_sqlalchemy import SQLAlchemy
from flask_babel import Babel
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_admin.contrib.sqla import ModelView

db = SQLAlchemy()
DB_NAME = "database.db"
babel = Babel()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config['FLASK_ENV'] = 'development'
    app.config['SECRET_KEY'] = 'anykey'
    app.config['FLASK_ADMIN_SWATCH'] = 'cosmo'
    app.config['BABEL_DEFAULT_LOCALE'] = 'eng'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{path.join(path.dirname(__file__), DB_NAME)}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
    db.init_app(app)
    babel.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db, render_as_batch=True)
    
    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    with app.app_context():
        create_database(app)

    from website.admin_views import MyMainView
    from .models import User, Organization, Report, Version_report, Ticket, DirUnit, DirProduct, Sections, Message
    
    from website.admin.user_view import UserView
    from website.admin.organization_view import OrganizationView
    from website.admin.report_view import ReportView
    from website.admin.version_report_view import Version_reportView
    from website.admin.ticket_view import TicketView
    from website.admin.dirUnit_view import DirUnitView
    from website.admin.dirProduct_view import DirProductView
    from website.admin.sections_view import SectionsView
    from website.admin.message_view import MessageView

    admin = Admin(app, 'Вернуться', index_view=MyMainView(), template_mode='bootstrap4', url='/')
    admin.add_view(UserView(User, db.session))
    admin.add_view(OrganizationView(Organization, db.session))
    admin.add_view(ReportView(Report, db.session))
    admin.add_view(Version_reportView(Version_report, db.session))
    admin.add_view(TicketView(Ticket, db.session))
    admin.add_view(DirUnitView(DirUnit, db.session))
    admin.add_view(DirProductView(DirProduct, db.session))
    admin.add_view(SectionsView(Sections, db.session))
    admin.add_view(MessageView(Message, db.session)) 

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print('Created Database!')
