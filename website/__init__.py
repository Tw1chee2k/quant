from os import path
from flask import Flask
from flask_login import LoginManager
from flask_admin import Admin
from flask_sqlalchemy import SQLAlchemy
from flask_babel import Babel
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from dbfread import DBF
import os
import pandas as pd
from werkzeug.security import generate_password_hash
import flask_profiler

db = SQLAlchemy()
babel = Babel()
migrate = Migrate()
bcrypt = Bcrypt()

DB_NAME = "database.db"

def create_app():
    app = Flask(__name__, static_url_path='/static')
    app.config['FLASK_ENV'] = 'development'
    app.config['SECRET_KEY'] = 'anykey'
    app.config['FLASK_ADMIN_SWATCH'] = 'cosmo'
    app.config['BABEL_DEFAULT_LOCALE'] = 'ru'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{path.join(path.dirname(__file__), DB_NAME)}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_timeout': 30
    }
    app.config['DEBUG'] = True
    app.config["flask_profiler"] = {
        "enabled": False,
        "storage": {
            "engine": "sqlite"
        },
        "basicAuth": {
            "enabled": True,
            "username": "admin",
            "password": "admin"
        },
        "ignore": [
            "^/static/.*"
        ]
    }

    flask_profiler.init_app(app)
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
    from .models import User, Organization, Report, Version_report, Ticket, DirUnit, DirProduct, Sections, Message, News
    
    from website.admin.user_view import UserView
    from website.admin.organization_view import OrganizationView
    from website.admin.report_view import ReportView
    from website.admin.version_report_view import Version_reportView
    from website.admin.ticket_view import TicketView
    from website.admin.dirUnit_view import DirUnitView
    from website.admin.dirProduct_view import DirProductView
    from website.admin.sections_view import SectionsView
    from website.admin.message_view import MessageView
    from website.admin.news_view import NewsView
    
    from website.admin.image_view import ImageView
    from website.admin.dop_view import DopView
    
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
    admin.add_view(NewsView(News, db.session)) 
    admin.add_view(ImageView())
    admin.add_view(DopView())

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print('Created Database!')

        from .models import User, Organization, DirUnit, DirProduct, News

        website_path = os.path.dirname(os.path.abspath(__file__)) 
        Brest_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Брест.dbf')
        Vitebsk_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Витебск.dbf')
        Gomel_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Гомель.dbf')
        Grodno_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Гродно.dbf')
        Minsk_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Минск.dbf')
        MinskRegion_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Минск_область.dbf')
        Migilev_org_data_path = os.path.join(website_path, 'dop_info/organizations', 'Могилев.dbf')

        columns_org = ['OKPO', 'NAME1', 'NAME2', 'NAME3', 'NAME4', 'NAME5', 'NAME6', 'MIN', 'UNP']

        Brest_org_data = read_dbf(Brest_org_data_path, columns_org)
        Vitebsk_org_data = read_dbf(Vitebsk_org_data_path, columns_org)
        Gomel_org_data = read_dbf(Gomel_org_data_path, columns_org)
        Grodno_org_data = read_dbf(Grodno_org_data_path, columns_org)
        Minsk_org_data = read_dbf(Minsk_org_data_path, columns_org)
        MinskRegion_org_data = read_dbf(MinskRegion_org_data_path, columns_org)
        Migilev_org_data = read_dbf(Migilev_org_data_path, columns_org)

        city_all_data = pd.concat([
            pd.DataFrame(Brest_org_data, columns=columns_org),
            pd.DataFrame(Vitebsk_org_data, columns=columns_org),
            pd.DataFrame(Gomel_org_data, columns=columns_org),
            pd.DataFrame(Grodno_org_data, columns=columns_org),
            pd.DataFrame(Minsk_org_data, columns=columns_org),
            pd.DataFrame(MinskRegion_org_data, columns=columns_org),
            pd.DataFrame(Migilev_org_data, columns=columns_org)
        ], ignore_index=True)

        MinskRegion_min_data_path = os.path.join(website_path, 'dop_info/ministerstvo', 'MinskReg_min.dbf')
        columns_min = ['MIN', 'NAME']
        MinskRegion_min_data = read_dbf(MinskRegion_min_data_path, columns_min)

        min_all_data = pd.DataFrame(MinskRegion_min_data, columns=columns_min)
        merged_data = city_all_data.merge(min_all_data, on='MIN', how='left')

        merged_data['MIN'] = merged_data['NAME']
        merged_data = merged_data.drop(columns=['NAME'])

        if Organization.query.count() == 0:
            for _, row in merged_data.iterrows():
                organization = Organization(
                    okpo=row['OKPO'],
                    full_name=' '.join(filter(None, [row['NAME1'], row['NAME2'], row['NAME3'], row['NAME4'], row['NAME5'], row['NAME6']])),
                    ministry=row['MIN'],
                    ynp=row['UNP']
                )
                db.session.add(organization)
                db.session.commit()

            dop_org_data = [
                ('Брестское областное управление', 1000),
                ('Витебское областное управление', 2000),
                ('Гомельское областное управление', 3000),
                ('Гродненское областное управление', 4000),
                ('Минское областное управление', 5000),
                ('Могилевское областное управление', 6000),
                ('Управление г. Минск', 7000),
                ('Департамент по энергоэффективности', 8000),
            ]
            
            org_dict = {}
            for org_data in dop_org_data:
                dop_org = Organization(full_name=org_data[0], okpo=org_data[1])
                db.session.add(dop_org)
                db.session.commit()
                org_dict[org_data[0]] = dop_org.id

            if User.query.count() == 0:
                users_data = [
                    ('Аудитор', 'BrestReg@gmail.com', None, None, generate_password_hash('1234'), 'Брестское областное управление'),
                    ('Аудитор', 'VitebskReg@gmail.com', None, None, generate_password_hash('1234'), 'Витебское областное управление'),
                    ('Аудитор', 'GomelReg@gmail.com', None, None, generate_password_hash('1234'), 'Гомельское областное управление'),
                    ('Аудитор', 'GrodnoReg@gmail.com', None, None, generate_password_hash('1234'), 'Гродненское областное управление'),
                    ('Аудитор', 'MinskReg@gmail.com', None, None, generate_password_hash('1234'), 'Минское областное управление'),
                    ('Аудитор', 'MogilevReg@gmail.com', None, None, generate_password_hash('1234'), 'Могилевское областное управление'),
                    ('Аудитор', 'Minsk@gmail.com', None, None, generate_password_hash('1234'), 'Управление г. Минск'),
                    ('Аудитор', 'HZ@gmail.com', None, None, generate_password_hash('1234'), 'Департамент по энергоэффективности'),
                    ('Администратор', 'tw1che.2k@gmail.com', 'Сидоров Максим Андреевич', '+375445531847', generate_password_hash('1234'), None),
                    ('Респондент', 'info@kvantas-as', 'Санников Вячеслав Степанович', '3650433', generate_password_hash('1234'), None),
                    ('Респондент', 'maxsidorov2017@gmail.com', 'Харлап Алексей Игорьевич', '+375296470299', generate_password_hash('1234'), None),
                ]

                for user_data in users_data:
                    user = User(
                        type=user_data[0],
                        email=user_data[1],
                        fio=user_data[2],
                        telephone=user_data[3],
                        password=user_data[4],
                        organization_id=org_dict.get(user_data[5]) if user_data[5] else None
                    )
                    db.session.add(user)
                    db.session.commit()

        if DirUnit.query.count() == 0:   
            units_data = [
                (1, 'тыс. кВт. ч', 'тыс. кВт. ч'),
                (2, 'Гкал', 'Гкал'),
                (3, 'т', 'т'),
                (4, 'пог.м проход', 'пог.м проход'),
                (5, 'тыс. м3', 'тыс. м3'),
                (6, 'м', 'м'),
                (7, 'шт', 'шт'),
                (8, 'усл. м3', 'усл. м3'),
                (9, 'м2', 'м2'),
                (10, 'м3', 'м3'),
                (11, 'усл. ед.', 'усл. ед.'),
                (12, 'тыс. усл. ед.', 'тыс. усл. ед.'),
                (13, 'тыс. шт. усл. кирп.', 'тыс. шт. усл. кирп.'),
                (14, 'тыс. м2', 'тыс. м2'),
                (15, 'тыс. пог. м', 'тыс. пог. м'),
                (16, 'тыс. дм2', 'тыс. дм2'),
                (17, 'тыс. пар', 'тыс. пар'),
                (18, 'тыс. ед.', 'тыс. ед.'),
                (19, 'тыс. усл. пар', 'тыс. усл. пар'),
                (20, 'усл. т', 'усл. т'),
                (21, 'т. ном', 'т. ном'),
                (22, 'тыс. усл. банк', 'тыс. усл. банк'),
                (23, 'тыс. дал', 'тыс. дал'),
                (24, 'дал', 'дал'),
                (25, 'гол', 'гол'),
                (26, 'тыс. шт', 'тыс. шт'),
                (27, 'усл. рем', 'усл. рем'),
                (28, 'тыс. м3 сут.°С', 'тыс. м3 сут.°С'),
                (29, 'чел/год', 'чел/год'),
                (30, '10 тыс. т км брут', '10 тыс. т км брут'),
                (31, 'тыс. т', 'тыс. т'),
                (32, 'км', 'км'),
                (33, 'тыс. м2 сут.°С', 'тыс. м2 сут.°С'),
                (34, 'Гкал/тхсут.', 'Гкал/тхсут.'),
                (35, 'кВтч/тхсут.', 'кВтч/тхсут.'),
                (36, 'усл. шт', 'усл. шт'),
                (37, 'тыс. т км', 'тыс. т км'),
                (38, 'млн. м3 км', 'млн. м3 км'),
                (39, 'тыс. т  км', 'тыс. т  км'),
                (40, 'тыс. ампул', 'тыс. ампул'),
                (41, 'тыс. упак', 'тыс. упак'),
                (42, 'тыс. флак', 'тыс. флак'),
                (43, 'норм. ч', 'норм. ч'),
                (44, 'усл. км', 'усл. км'),
                (45, 'л', 'л'),
                (46, 'тыc. усл. краско-оттисков', 'тыc. усл. краско-оттисков'),
                (47, 'час работы оборудо-вания', 'час работы оборудо-вания'),
                (48, 'тн', 'тн'),
                (49, 'усл. комплект', 'усл. комплект'),
                (50, 'норма-человеко-час', 'норма-человеко-час'),
                (51, 'вагоно-сутки', 'вагоно-сутки'),
                (52, 'тыс. усл. ящ', 'тыс. усл. ящ'),
                (53, 'т. у. т.', 'т. у. т.'),
                (54, 'усл. блюда', 'усл. блюда'),
                (55, 'усл. свет.', 'усл. свет.'),
                (56, 'га', 'га'),
                (57, 'койко-суток', 'койко-суток'),
                (58, 'чел.', 'чел.'),
                (59, 'посещ.', 'посещ.'),
                (60, 'Мкал', 'Мкал'),
                (61, 'тыс. экз', 'тыс. экз'),
                (62, 'чел., м2', 'чел., м2'),
                (63, 'м3 усл. ед.', 'м3 усл. ед.'),
                (64, 'тыс. усл. кус', 'тыс. усл. кус'),
                (65, 'кг', 'кг'),
                (66, 'пл. т', 'пл. т'),
                (67, 'т сут.', 'т сут.'),
                (68, 'тыс. м3 привед', 'тыс. м3 привед'),
                (69, 'согл.', 'согл.'),
                (70, 'тыс. т  км', 'тыс. т  км'),
                (71, '% (включая покупную)', '% (включая покупную)'),
                (72, '%', '%'),
                (73, 'п.м', 'п.м'),
                (74, 'усл.ед.', 'усл.ед.'),
            ]

            for unit_data in units_data:
                unit = DirUnit(IdUnit=unit_data[0], CodeUnit=unit_data[1], NameUnit=unit_data[2])
                db.session.add(unit)
            db.session.commit()
            
        if DirProduct.query.count() == 0:     
            products_data = [
                (1, '0010', 'Электроэнергия, отпущенная электростанциями, работающими на котельно-печном топливе', True, False, False, 1, None, None),
                (2, '0011', 'Электроэнергия, израсходованная на собственные нужды электростанций: на производство теплоэнергии', False, False, True, 2, None, None),
                (3, '0012', 'Электроэнергия, израсходованная на собственные нужды электростанций: на производство электроэнергии', False, False, True, 1, None, None),
                (4, '0015', 'Электроэнергия, отпущенная когенерационными и иными подобными установками', True, False, False, 1, None, None),
                (5, '0016', 'Тепловая энергия, отпущенная когенерационными и иными подобными установками', True, False, True, 2, None, None),
                (6, '0020', 'Теплоэнергия, отпущенная электростанциями и районными котельными', True, False, True, 2, None, None),
                (7, '0021', 'Теплоэнергия, отпущенная электростанциями и районными котельными (в том числе отпущенная районными котельными)', True, False, True, 2, None, None),
                (8, '0024', 'Теплоэнергия, отпущенная промышленно-производственными котельными производительностью 10 Гкал/час и более', True, False, True, 2, None, None),
                (9, '0025', 'Теплоэнергия, отпущенная промышленно-производственными котельными производительностью от 0,5 до 10 Гкал/час', True, False, True, 2, None, None),
                (10, '0026', 'Теплоэнергия, отпущенная отопительными котельными производительностью 10 Гкал/час  и более', True, False, True, 2, None, None),
                (11, '0027', 'Теплоэнергия, отпущенная отопительными котельными производительностью от 0,5 до 10 Гкал/час', True, False, True, 2, None, None),
                (12, '0030', 'Теплоэнергия, отпущенная отопительно-производственными котельными, производительностью 10 Гкал/час и более', True, False, True, 2, None, None),
                (13, '0031', 'Теплоэнергия, отпущенная отопительно-производственными котельными производительностью от 0,5 до 10 Гкал/час', True, False, True, 2, None, None),
                (14, '0040', 'Потери электроэнергии в электрических сетях Белорусской энергетической системы', False, False, True, 1, None, None),
                (15, '0041', 'Производственные, хозяйственные нужды и прочие виды деятельности Белорусской энергетической системы', False, False, True, 2, None, None),
                (16, '0042', 'Производственные, хозяйственные нужды и прочие виды деятельности Белорусской энергетической системы', False, False, True, 1, None, None),
                (17, '0050', 'Потери теплоэнергии в магистральных тепловых сетях Белорусской энергетической системы', False, True, False, 2,None, None),
                (18, '0051', 'Потери теплоэнергии в магистральных тепловых сетях организаций других республиканских органов государственного управления', False, True, False, 2, None, None),
                (19, '0052', 'Потери теплоэнергии в тепловых сетях организаций  при транзите тепловой энергии от сторонних организаций', False, True, False, 2, None, None),
                (20, '0053', 'Потери теплоэнергии в квартальных тепловых сетях организаций', False, True, False, 2, None, None),
                (21, '0060', 'Добыча нефти всеми способами, включая газовый конденсат (с учетом расхода на внутрипромышленную перекачку, вторичные методы эксплуатации и водоснабжения) – всего', True, True, True, 3, None, None),
                (22, '0065', 'Добыча нефти методом водотеплового воздействия', True, False, True, 3, None, None),
                (23, '0066', 'Добыча нефти методом паротеплового воздействия', True, False, True, 3, None, None),
                (24, '0067', 'Добыча нефти газлифтная', True, False, True, 3, None, None),
                (25, '0068', 'Добыча нефти прочие', True, False, True, 3, None, None),
                (26, '0070', 'Бурение нефтегазовых скважин разведочное', True, True, True, 4, None, None),
                (27, '0080', 'Бурение нефтегазовых скважин эксплуатационное', True, True, True, 4, None, None),
                (28, '0090', 'Подготовка нефти на промыслах', True, False, False, 3, None, None),
                (29, '0140', 'Переработка нефти, включая газовый конденсат – всего', True, True, True, 3, None, None),
                (30, '0141', 'первичная переработка нефти', True, True, True, 3, None, None),
                (31, '0142', 'гидрокрекинг', True, True, True, 3, None, None),
                (32, '0145', 'каталитический риформинг', True, True, True, 3, None, None),
                (33, '0146', 'производство масел', True, True, True, 3, None, None),
                (34, '0148', 'гидроочистка', True, True, True, 3, None, None),
                (35, '0149', 'каталитический риформинг для получения ароматических углеводородов', True, True, True, 3, None, None),
                (36, '0152', 'парекс', True, True, True, 3, None, None),
                (37, '0170', 'Переработка газа', True, True, True, 5, None, None),   
                (38, '0290', 'Топливные брикеты', True, True, True, 3, None, None),
                (39, '0295', 'Щепа топливная', True, True, True, 3, None, None),
                (40, '0300', 'Добыча и переработка торфа', True, True, True, 3, None, None),
                (41, '0380', 'Кислород', True, True, True, 5, None, None),
                (42, '0390', 'Сжатый воздух, отпущенный (проданный) на сторону при t=20оС и Р=1,4 атм.', True, True, True, 68, None, None),
                (43, '0410', 'Чугун', True, True, True, 3, None, None),
                (44, '0460', 'Прокат черных металлов (включая поковки из слитков)', True, True, True, 3, None, None),
                (45, '0470', 'Трубы стальные', True, True, True, 3, None, None),
                (46, '0480', 'Трубы чугунные напорные', True, False, True, 3, None, None),
                (47, '0490', 'ПИ-трубы', True, False, True, 6, None, None),
                (48, '0690', 'Метизы (из готового проката)', True, False, True, 3, None, None),
                (49, '0755', 'Добыча других руд и горных масс - всего', False, False, True, 3, None, None),
                (50, '1160', 'Сера - всего', True, True, True, 3, None, None),
                (51, '1163', 'в том числе сера газовая', True, True, True, 3, None, None),
                (52, '1180', 'Аммиак синтетический - всего', True, True, True, 3, None, None),
                (53, '1181', 'Аммиак синтетический произведенный на агрегатах М-400, М-450', False, True, True, 3, None, None),
                (54, '1182', 'Аммиак синтетический произведенный на других агрегатах', False, True, True, 3, None, None),
                (55, '1220', 'Кислота серная (в пересчете на 100% содержания, кроме отработанной)', True, False, True, 3, None, None),
                (56, '1300', 'Азот', False, False, True, 5, None, None),
                (57, '1310', 'Аргон', False, False, True, 5, None, None),
                (58, '1320', 'Натрий сернокислый 100 %', False, True, True, 3, None, None),
                (59, '1350', 'Минеральные удобрения - всего', False, True, True, 3, None, None),
                (60, '1360', 'калийные удобрения в пересчете  на 100% К2О', False, True, True, 3, None, None),
                (61, '1370', 'фосфатные удобрения в пересчете на 100% Р2О5', False, True, True, 3, None, None),
                (62, '1380', 'азотные удобрения в пересчете  на 100% N2', False, True, True, 3, None, None),
                (63, '1400', 'Волокна и нити химические - всего', True, True, True, 3, None, None),
                (64, '1401', 'нити текстильные синтетические: капроновые', True, True, True, 3, None, None),
                (65, '1402', 'нити текстильные синтетические: полиэфирные', True, True, True, 3, None, None),
                (66, '1404', 'нити синтетические для корда и техники: капроновые', True, True, True, 3, None, None),
                (67, '1406', 'нити синтетические для корда и техники: полиэфирные', True, True, True, 3, None, None),
                (68, '1407', 'нити синтетические для корда и техники: полипропиленовые', True, True, True, 3, None, None),
                (69, '1409', 'волокна синтетические: капроновые', True, True, True, 3, None, None),
                (70, '1411', 'волокна синтетические: полиэфирные', True, True, True, 3, None, None),
                (71, '1413', 'волокна синтетические: полиакрилонитрильные', True, True, True, 3, None, None),
                (72, '1415', 'волокна синтетические: поливинилхлоридные', True, True, True, 3, None, None),
                (73, '1416', 'нити текстильные искусственные: вискозные', True, True, True, 3, None, None),
                (74, '1419', 'нити текстильные искусственные: для кордной ткани и технических изделий', True, True, True, 3, None, None),
                (75, '1420', 'волокна искусственные: вискозные', True, True, True, 3, None, None),
                (76, '1422', 'прочие виды волокон и нитей химических', True, True, True, 3, None, None),
                (77, '1430', 'Смолы синтетические и пластмассы - всего', True, True, True, 3, None, None),
                (78, '1431', 'полиэтилен высокого давления', True, True, True, 3, None, None),
                (79, '1434', 'смолы карбамидные', False, True, True, 3, None, None),
                (80, '1435', 'диметилтерефталат', True, True, True, 3, None, None),
                (81, '1437', 'капролактам', True, True, True, 3, None, None),
                (82, '1438', 'дисперсии (эмульсии) поливинил-ацетатные', True, True, True, 3, None, None),
                (83, '1443', 'прочие виды синтетических смол и пластмасс', True, True, True, 3, None, None),
                (84, '1444', 'полиэтилентерефталат', True, True, True, 3, None, None),
                (85, '1445', 'Терефталевая кислота', True, True, True, 3, None, None),
                (86, '1446', 'Ангидрид фталевый', True, True, True, 3, None, None),
                (87, '1447', 'Лаки на конденсационных смолах', True, True, True, 3, None, None),
                (88, '1448', 'Эмали, грунтовки и шпатлевки на конденсационных смолах', True, True, True, 3, None, None),
                (89, '1450', 'Химические средств защиты растений', True, True, True, 3, None, None),
                (90, '1660', 'Автомотошины', False, True, True, 7, None, None),
                (91, '1680', 'Литье чугунное', True, True, True, 3, None, None),
                (92, '1700', 'Литье цветное', True, True, True, 3, None, None),
                (93, '1710', 'Литье стальное', True, True, True, 3, None, None),
                (94, '1860', 'Плиты древесностружечные', True, True, True, 8, None, None),
                (95, '1870', 'Плиты древесноволокнистые', True, True, True, 9, None, None),
                (96, '1890', 'Деревянные изделия', True, True, True, 10, None, None),
                (97, '1900', 'Смола древесная и продукты ее переработки', True, True, True, 3, None, None),
                (98, '1930', 'Мебель', True, True, True, 11, None, None),
                (99, '1970', 'Целлюлоза', True, True, True, 3, None, None),
                (100, '1980', 'Бумага', True, True, True, 3, None, None),
                (101, '1981', 'Полиграфические изделия', True, True, True, 12, None, None),
                (102, '1990', 'Картон и изделия из него', True, True, True, 3, None, None),
                (103, '2000', 'Цемент - всего', True, True, True, 3, None, None),
                (104, '2001', 'Цемент - из него клинкер', True, True, True, 3, None, None),
                (105, '2010', 'Известь', True, True, True, 3, None, None),
                (106, '2015', 'Гипс и изделия из него', True, True, True, 3, None, None),
                (107, '2016', 'Мука известняковая и продукты ее переработки', True, True, True, 3, None, None),
                (108, '2020', 'Кирпич глиняный', True, True, True, 13, None, None),
                (109, '2030', 'Кирпич силикатный', True, True, True, 13, None, None),
                (110, '2035', 'Металлоконструкции', True, True, True, 3, None, None),
                (111, '2050', 'Шифер', False, True, True, 12, None, None),
                (112, '2055', 'Мягкие кровельные материалы', True, True, True, 14, None, None),
                (113, '2056', 'Синтетические покрытия', False, True, True, 9, None, None),
                (114, '2060', 'Бетонные и железобетонные изделия', True, True, True, 10, None, None),
                (115, '2070', 'Товарный бетон и раствор', True, True, True, 10, None, None),
                (116, '2080', 'Товарная арматура', False, False, True, 3, None, None),
                (117, '2132', 'Столярные изделия', True, True, True, 9, None, None),
                (118, '2134', 'Погонажные изделия', False, True, True, 15, None, None),
                (119, '2180', 'Производство теплоизоляционных материалов', True, True, True, 10, None, None),
                (120, '2210', 'Керамзит и изделия из него', True, True, True, 10, None, None),
                (121, '2255', 'Производство нерудных материалов', True, True, True, 10, None, None),
                (122, '2270', 'Асфальт и асфальтобетон', True, True, True, 3, None, None),
                (123, '2310', 'Стекло и изделия из него', True, True, True, 3, None, None),
                (124, '2315', 'Стекловолокно и изделия из него', True, True, True, 3, None, None),
                (125, '2320', 'Глина и керамические изделия', True, True, True, 3, None, None),
                (126, '2340', 'Резинотехнические изделия', False, True, True, 3, None, None),
                (127, '2350', 'Лакокрасочные изделия', True, True, True, 3, None, None),
                (128, '2360', 'Плиты и прочие изделия из природных камней', False, True, True, 9, None, None),
                (129, '2370', 'Плитки керамические', True, True, True, 9, None, None),
                (130, '2400', 'Ткани', True, True, True, 14, None, None),
                (131, '2410', 'Изделия из кожи', False, True, True, 16, None, None),
                (132, '2420', 'Мех искусственный', False, True, True, 14, None, None),
                (133, '2430', 'Ковры и ковровые изделия', False, True, True, 14, None, None),
                (134, '2440', 'Чулочно-носочные изделия', True, True, True, 17, None, None),
                (135, '2441', 'Чулочно-носочные изделия', True, True, True, 12, None, None),
                (136, '2450', 'Трикотажные изделия', False, True, True, 18, None, None),
                (137, '2451', 'Трикотажные изделия', False, True, True, 12, None, None),
                (138, '2460', 'Обувь кожаная', False, True, True, 19, None, None),
                (139, '2470', 'Обувь резиновая', True, True, True, 19, None, None),
                (140, '2480', 'Швейные изделия', False, True, True, 11, None, None),
                (141, '2481', 'Трикотажное полотно готовое', True, True, True, 20, None, None),
                (142, '2490', 'Пряжа - всего', True, True, True, 21, None, None),
                (143, '2500', 'Цельномолочная продукция в пересчете на молоко', True, True, True, 3, None, None),
                (144, '2501', 'Мороженое и десерты', False, True, True, 3, None, None),
                (145, '2510', 'Молочный сахар', False, True, True, 3, None, None),
                (146, '2520', 'Обезжиренная молочная продукция в пересчете на молоко', True, True, True, 3, None, None),
                (147, '2530', 'Солод пивоваренный', True, True, True, 3, None, None),
                (148, '2540', 'Маргариновая продукция', False, True, True, 3, None, None),
                (149, '2550', 'Майонез', False, True, True, 3, None, None),
                (150, '2560', 'Консервы молочные', False, True, True, 22, None, None),
                (151, '2570', 'Мыло и моющие средства', False, True, True, 3, None, None),
                (152, '2580', 'Мясо (включая субпродукты 1 категории)', True, True, True, 3, None, None),
                (153, '2581', 'Субпродукты 2 категории', True, True, True, 3, None, None),
                (154, '2584', 'Прочая продукция мясопереработки', True, True, True, 3, None, None),
                (155, '2585', 'Полуфабрикаты', True, True, True, 3, None, None),
                (156, '2590', 'Производство молока', False, True, True, 3, None, None),
                (157, '2600', 'Концентраты пищевые', False, True, True, 3, None, None),
                (158, '2610', 'Консервы мясные', False, True, True, 22, None, None),
                (159, '2620', 'Масло животное', False, True, True, 3, None, None),
                (160, '2630', 'Сыры жирные', False, True, True, 3, None, None),
                (161, '2635', 'Сыры нежирные', False, True, True, 3, None, None),
                (162, '2636', 'Сыры плавленые', True, True, True, 3, None, None),
                (163, '2640', 'Сухие молочные изделия и смеси', True, True, True, 3, None, None),
                (164, '2650', 'Колбасные изделия', True, True, True, 3, None, None),
                (165, '2660', 'Пиво', False, True, True, 23, None, None),
                (166, '2665', 'Безалкогольные напитки', True, True, True, 23, None, None),
                (167, '2670', 'Производство холода', False, True, True, 2, None, None),
                (168, '2680', 'Консервы рыбные', True, True, True, 22, None, None),
                (169, '2690', 'Консервы плодоовощные', True, True, True, 22, None, None),
                (170, '2695', 'Сушеные овощи', True, True, True, 3, None, None),
                (171, '2700', 'Углекислота', False, True, True, 3, None, None),
                (172, '2710', 'Меланж', False, True, True, 3, None, None),
                (173, '2720', 'Кондитерские изделия', True, True, True, 3, None, None),
                (174, '2730', 'Масло растительное', False, True, True, 3, None, None),
                (175, '2740', 'Картофелепродукты', False, True, True, 3, None, None),
                (176, '2750', 'Производство соли', False, True, True, 3, None, None),
                (177, '2760', 'Спирт этиловый', False, True, True, 24, None, None),
                (178, '2770', 'Ликеро-водочные изделия и вино', False, True, True, 23, None, None),
                (179, '2790', 'Лимонная кислота', False, True, True, 3, None, None),
                (341, '2800', 'Очистка зерна', False, False, True, 66, None, None),
                (342, '2810', 'Сушка зерна', True, True, True, 66, None, None),
                (182, '2820', 'Мука', False, True, True, 3, None, None),
                (183, '2830', 'Крупа', False, True, True, 3, None, None),
                (184, '2840', 'Макаронные изделия', False, True, True, 3, None, None),
                (185, '2850', 'Комбикорма сухие, гранулированные и комбинированные', False, True, True, 3, None, None),
                (186, '2855', 'Производство сахара-рафинада', True, True, True, 3, None, None),
                (187, '2860', 'Хлеб и хлебобулочные изделия', True, True, True, 3, None, None),
                (188, '2870', 'Льноволокно', True, True, True, 3, None, None),
                (189, '2880', 'Производство сахара', True, True, True, 3, None, None),
                (190, '2900', 'Содержание свиней', True, True, True, 25, None, None),
                (191, '2910', 'Содержание крупного рогатого скота', True, True, True, 25, None, None),
                (192, '2911', 'Содержание крупного рогатого скота (привес)', True, True, True, 3, None, None),
                (193, '2920', 'Содержание птицы', True, True, True, 25, None, None),
                (194, '2930', 'Производство дрожжей', True, True, True, 3, None, None),
                (195, '2940', 'Производство казеина сухого технического', False, True, True, 3, None, None),
                (196, '2941', 'Производство казеинатов пищевых', False, True, True, 3, None, None),
                (197, '2950', 'Производство яиц', True, True, True, 26, None, None),
                (198, '2960', 'Рыба (живая, обработанная)', True, True, True, 3, None, None),
                (199, '3000', 'Подъем и подача воды', False, False, True, 5, None, None),
                (200, '3010', 'Прием, очистка и подача сточных вод', False, False, True, 5, None, None),
                (201, '3100', 'Строительно-монтажные работы, выполненные собственными силами', True, True, True, 11, None, None),
                (202, '3200', 'Ремонтные работы', True, True, True, 27, None, None),
                (319, '3300', 'Обогрев и вентиляция', True, True, True, 28, None, None),
                (325, '0035', 'Транспортировка тепловой энергии до потребителя', False, False, True, 2, None, None),
                (205, '3303', 'Кондиционирование', False, True, True, 28, None, None),
                (206, '3310', 'Горячее водоснабжение', True, True, True, 29, None, None),
                (207, '3320', 'Электрообогрев', False, False, True, 28, None, None),
                (208, '3400', 'Производственные нужды железной дороги', True, True, True, 30, None, None),
                (209, '3410', 'Электротяга поездов железной дороги', False, False, True, 30, None, None),
                (210, '3430', 'Погрузочно-разгрузочные работы', False, False, True, 31, None, None),
                (211, '3500', 'Электротяга городского пассажирского транспорта', False, False, True, 32, None, None),
                (321, '2255', 'Производство нерудных материалов', True, True, True, 3, None, None),
                (347, '4201', 'Реализация природного газа', False, False, True, 10, None, None),
                (343, '3610', 'Услуги по складированию и хранению продукции', True, True, True, 67, None, None),
                (216, '3700', 'Инкубация яиц', True, True, True, 26, None, None),
                (217, '3800', 'Изделия из пластмасс', True, True, True, 3, None, None),
                (218, '3900', 'Машины швейные', True, True, True, 36, None, None),
                (219, '4000', 'Трансформаторы', True, True, True, 11, None, None),
                (220, '4010', 'Сельскохозяйственная техника', True, True, True, 11, None, None),
                (221, '4020', 'Подшипники - всего', True, True, True, 11, None, None),
                (222, '4030', 'Автомобили', True, True, True, 11, None, None),
                (223, '4040', 'Электродвигатели', True, True, True, 11, None, None),
                (224, '4050', 'Станки металлообрабатывающие - всего', True, True, True, 11, None, None),
                (225, '4060', 'Стиральные машины', True, True, True, 11, None, None),
                (226, '4070', 'Автобусы', True, True, True, 11, None, None),
                (227, '4080', 'Тракторы', True, True, True, 11, None, None),
                (228, '4090', 'Мотоциклы', True, True, True, 11, None, None),
                (229, '4100', 'Велосипеды', True, True, True, 11, None, None),
                (230, '4110', 'Лифты', True, True, True, 11, None, None),
                (231, '4120', 'Транспортировка нефти', True, True, True, 37, None, None),
                (232, '4130', 'Транспортировка газа', True, True, True, 38, None, None),
                (234, '4150', 'Котлы отопительные', True, True, True, 11, None, None),
                (235, '4160', 'Холодильники и морозильники бытовые', True, True, True, 11, None, None),
                (236, '4170', 'Телевизоры', True, True, True, 11, None, None),
                (237, '4180', 'Часы', True, True, True, 11, None, None),
                (238, '4190', 'Плиты газовые', True, True, True, 36, None, None),
                (239, '4191', 'Прочие товары народного потребления', True, True, True, 11, None, None),
                (240, '4200', 'Реализация нефтепродуктов', False, False, True, 3, None, None),
                (241, '4201', 'Реализация газа СУГ', False, False, True, 3, None, None),
                (339, '4226', 'Вентиляторы', True, True, True, 11, None, None),
                (340, '1830', 'Шпон строганый', True, True, True, 5, None, None),
                (244, '4230', 'Двигатели внутреннего сгорания', True, True, True, 11, None, None),
                (245, '4240', 'Дорожная техника', True, True, True, 11, None, None),
                (246, '4250', 'Мелиоративная техника', True, True, True, 11, None, None),
                (247, '4300', 'Медикаменты в ампулах', False, True, True, 40, None, None),
                (248, '4310', 'Медикаменты в таблетках', False, True, True, 41, None, None),
                (249, '4320', 'Медикаменты во флаконах', False, True, True, 42, None, None),
                (250, '4330', 'Медицинское оборудование и инструменты', True, True, True, 11, None, None),
                (251, '4400', 'Судостроение', False, True, True, 43, None, None),
                (252, '4430', 'Строительная техника', True, True, True, 36, None, None),
                (253, '4440', 'Электротехнические изделия', True, True, True, 36, None, None),
                (254, '4450', 'Зеркальные изделия', True, True, True, 9, None, None),
                (255, '4460', 'Кабели и проволока электротехническая', True, True, True, 44, None, None),
                (256, '4470', 'Эмалированные изделия', True, True, True, 20, None, None),
                (257, '4480', 'Посуда', True, True, True, 45, None, None),
                (348, '4202', 'Потери природного газа', True, False, False, 10, None, None),
                (259, '4490', 'Музыкальные инструменты', False, True, True, 36, None, None),
                (260, '4600', 'Услуги связи', False, False, True, 47, None, None),
                (261, '4701', 'Бытовое обслуживание', False, True, True, 48, None, None),
                (262, '5001', 'Фотоаппараты и оптические изделия', True, True, True, 11, None, None),
                (263, '5002', 'Электролампы', True, True, True, 36, None, None),
                (264, '5003', 'Продукция машиностроения, запчасти и комплектующие', True, True, True, 11, None, None),
                (265, '5004', 'Гидрооборудование', True, True, True, 36, None, None),
                (266, '5005', 'Пластик слоистый', True, True, True, 14, None, None),
                (267, '5006', 'Тарооборудование', True, True, True, 7, None, None),
                (268, '5007', 'Сетчатые мешки полиэтиленовые', False, True, True, 26, None, None),
                (322, '2961', 'Выращивание рыбопосадочного материала', True, True, True, 61, None, None),
                (349, '4203', 'Потери сжатого газа', True, False, False, 65, None, None),
                (350, '5025', 'Прием, перекачка и очистка стоков', False, False, True, 5, None, None),
                (352, '0040', 'Потери электроэнергии в электрических сетях Белорусской энергетической системы', False, False, True, 70, None, None),
                (269, '5008', 'Торговое оборудование', False, True, True, 49, None, None),
                (270, '5009', 'Капитальный и восстановительный ремонт подвижного состава и его составных частей', False, True, True, 27, None, None),
                (271, '5010', 'Производство подвижного состава (прицепы, полуприцепы)', True, True, True, 11, None, None),
                (272, '5011', 'Техническое обслуживание и ремонт подвижного состава в автотранспортных предприятиях', True, True, True, 50, None, None),
                (273, '5012', 'Объем работ предприятия газового хозяйства', True, True, True, 11, None, None),
                (274, '5013', 'Отопление вагонов', True, False, True, 51, None, None),
                (275, '5014', 'Шпон строганный синтетический', False, True, True, 14, None, None),
                (276, '5015', 'Заготовка и первичная переработка древесины', False, True, True, 5, None, None),
                (277, '5016', 'Спички', True, True, True, 52, None, None),
                (351, '6000', 'Другие нормируемые виды продукции (услуг, работ)', True, True, True, 69, None, None),
                (279, '7000', 'Предельный уровень потребления (объекты непроизводственного характера, коммунально-бытового назначения и другие)', True, False, False, 53, None, None),
                (280, '7000', 'Предельный уровень потребления (объекты непроизводственного характера, коммунально-бытового назначения и другие)', False, False, True, 1, None, None),
                (281, '7000', 'Предельный уровень потребления (объекты непроизводственного характера, коммунально-бытового назначения и другие)', False, True, False, 2, None, None),
                (282, '9001', 'Всего по нормированному потреблению', True, False, False, 53, None, None),
                (283, '9001', 'Всего по нормированному потреблению', False, False, True, 1, None, None),
                (284, '9001', 'Всего по нормированному потреблению', False, True, False, 2, None, None),
                (285, '9010', 'Прочее потребление', True, False, False, 53, None, None),
                (286, '9010', 'Прочее потребление', False, False, True, 1, None, None),
                (287, '9010', 'Прочее потребление', False, True, False, 2, None, None),
                (288, '9100', 'Всего потребление (сумма строк 9001, 9010)', True, False, False, 53, None, None),
                (289, '9100', 'Всего потребление (сумма строк 9001, 9010)', False, False, True, 1, None, None),
                (290, '9100', 'Всего потребление (сумма строк 9001, 9010)', False, True, False, 2, None, None),
                (323, '3600', 'Отопление теплиц', True, True, True, 28, None, None),
                (292, '0385', 'Водород', True, True, True, 10, None, None),
                (293, '0471', 'Фасонные части для стальных труб', True, False, True, 3, None, None),
                (294, '0481', 'Фасонные части для чугунных труб', True, False, True, 3, None, None),
                (295, '0491', 'Фасонные части для ПИ-труб', True, True, True, 36, None, None),
                (296, '1800', 'Сушка древесины', True, True, True, 10, None, None),
                (297, '1880', 'Сэндвич панели', True, True, True, 14, None, None),
                (331, '1891', 'Прочие продукты лесопереработки', True, True, True, 63, None, None),
                (299, '2036', 'Металлоизделия', True, True, True, 36, None, None),
                (300, '2681', 'Прочая рыбная продукция', True, True, True, 3, None, None),
                (301, '2696', 'Прочая плодовоовощная продукция', True, True, True, 3, None, None),
                (302, '2861', 'Общественное питание', True, True, True, 54, None, None),
                (303, '2901', 'Содержание свиней (привес)', True, True, True, 3, None, None),
                (304, '2921', 'Содержание птицы (привес)', True, True, True, 3, None, None),
                (305, '3350', 'Уличное освещение', False, False, True, 55, None, None),
                (324, '5023', 'Места общего пользования общежитий', True, True, True, 62, None, None),
                (326, '0291', 'Пеллеты, гранулы', True, True, True, 48, None, None),
                (328, '1810', 'Пиломатериалы', True, True, True, 10, None, None),
                (306, '4255', 'Орошение земель', True, True, False, 56, None, None),
                (307, '4702', 'Стирка и химчистка белья', True, True, True, 3, None, None),
                (308, '5017', 'Услуги по использованию и ремонту автотранспорта', True, True, True, 11, None, None),
                (309, '5018', 'Воск и продукция из воска', True, True, True, 3, None, None),
                (310, '5019', 'Игрушки', True, True, True, 11, None, None),
                (311, '5020', 'Выращивание цветов и декоративных растений', True, True, True, 26, None, None),
                (312, '5021', 'Деятельность в сфере торговли, образования, культуры, спорта и т.п.', True, True, True, 9, None, None),
                (313, '5022', 'Услуги гостиниц, санаторно-курортных и лечебных учреждений', True, True, True, 57, None, None),
                (329, '1820', 'Шпон лущеный', True, True, True, 10, None, None),
                (315, '5024', 'Прием, перекачка воды в ЦТП', False, False, True, 10, None, None),
                (317, '5026', 'Услуги бани', True, True, True, 59, None, None),
                (318, '5027', 'Прессование отходов, вторсырья и ТБО', True, True, True, 3, None, None),
                (332, '1982', 'Обои', True, True, True, 64, None, None),
                (333, '2310', 'Стекло и изделия из него', True, True, True, 14, None, None),
                (334, '2310', 'Стекло и изделия из него', True, True, True, 11, None, None),
                (335, '2370', 'Плитки керамические', True, True, True, 10, None, None),
                (353, '0050', 'Потери теплоэнергии в магистральных тепловых сетях Белорусской энергетической системы', False, True, False, 70, None, None),
                (354, '0051', 'Потери теплоэнергии в магистральных тепловых сетях организаций других республиканских органов государственного управления', False, True, False, 71, None, None),
                (355, '0052', 'Потери теплоэнергии в тепловых сетях организаций  при транзите тепловой энергии от сторонних организаций', False, True, False, 71, None, None),
                (356, '0053', 'Потери теплоэнергии в квартальных тепловых сетях организаций', False, True, False, 71, None, None),
                (357, '0490', 'ПИ-трубы', True, True, True, 72, None, None),
                (358, '1891', 'Прочие продукты лесопереработки', True, True, True, 11, None, None),
                (359, '3310', 'Горячее водоснабжение', True, True, True, 58, None, None),
                (360, '4110', 'лифты', True, True, True, 73, None, None),
                (361, '4202', 'Потери природного газа', True, False, False, 71, None, None),
                (362, '4203', 'Потери сжатого газа', True, False, False, 71, None, None),
                (363, '4210', 'Приборы , средства автоматизации и связи и запасны части к ним', True, True, True, 11, None, None),
                (364, '4220', 'Насосы', True, True, True, 36, None, None),
                (365, '4480', 'Посуда', True, True, True, 11, None, None),
                (366, '4701', 'Бытовое обслуживание', True, True, True, 11, None, None),
                (367, '6000', 'Другие нормируемые виды продукции (услуг, работ)', True, True, True, 11, None, None), 
            ]
            
            for data in products_data:
                product = DirProduct(IdProduct=data[0], 
                                    CodeProduct=data[1], 
                                    NameProduct=data[2], 
                                    IsFuel=data[3], 
                                    IsHeat=data[4], 
                                    IsElectro=data[5], 
                                    IdUnit=data[6],
                                    DateStart=data[7], 
                                    DateEnd=data[8])
                db.session.add(product)
            db.session.commit()
        if News.query.count() == 0:   
            news_data = [
                ('..2024 будет проведено обновление системы учёта и обработки отчетов!', 'Уважаемые пользователи обработки отчетов! 18.07.2024 будет проведено обновление системы. В связи с этим некоторые возможности системы будут недоступны с 20:00 до 21:30 18.07.2024.', '8.jpg'),
            ]
            for i in news_data:
                news = News(title=i[0], 
                            text=i[1], 
                            img_name=i[2]) 
                db.session.add(news)   
                db.session.commit()

def read_dbf(file_path, columns):
    data = []
    for record in DBF(file_path):
        row = {col: record[col] for col in columns}
        data.append(row)
    return data 