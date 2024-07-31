# Основные модули Flask
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, send_file
from flask_login import login_user, logout_user, current_user, login_required, LoginManager

# Модули SQLAlchemy и модели
from .models import User, Organization, Report, Version_report, DirUnit, DirProduct, Sections, Ticket, Message
from . import db
from sqlalchemy import func
from sqlalchemy import asc
from sqlalchemy import desc

# Модули для работы с паролями
from werkzeug.security import check_password_hash, generate_password_hash

# Модули для отправки электронной почты
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Модули для работы с датами и временем
from datetime import datetime, timedelta

# Модули для обработки данных и чисел
import re
from decimal import Decimal, InvalidOperation

# Модули для работы с Excel
from flask import send_file
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side
from io import BytesIO

auth = Blueprint('auth', __name__)
login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = str(request.form.get('password'))
        remember = True if request.form.get('remember') else False 

        user = User.query.filter(func.lower(User.email) == func.lower(email)).first()
        if user:    
            if check_password_hash(user.password, password):
                flash('Авторизация прошла успешно', category='success')
                login_user(user, remember=remember) 
                return redirect(url_for('views.account'))
            else:
                flash('Не правильный пароль ', category='error')
                return redirect(url_for('auth.login'))
        else:
            flash('Нет пользователя с таким email', category='error')
            return redirect(url_for('auth.login')) 
    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Выполнен выход из аккаунта', category='success')
    return redirect(url_for('auth.login'))
    
@auth.route('/sign', methods=['GET', 'POST'])
def sign():
    if request.method == 'POST':
        email = request.form.get('email')
        fio = request.form.get('fio')
        telephone = request.form.get('telephone')
        password = request.form.get('password')
        full_name =  request.form.get('full_name')
        okpo = request.form.get('okpo')
        ynp = request.form.get('ynp')
        if User.query.filter_by(email=email).first() or Organization.query.filter_by(full_name=full_name).first() or Organization.query.filter_by(okpo=okpo).first() or Organization.query.filter_by(ynp=ynp).first():
            flash('Пользователь с таким email уже существует', category='error')
        elif not re.match(r'[\w\.-]+@[\w\.-]+', email):
            flash('Некорректный адрес электронной почты', category='error')  
        else:
            new_organization = Organization(
                okpo=okpo,
                full_name=full_name,
                ynp=ynp, 

            )
            db.session.add(new_organization)
            db.session.commit()
            new_user = User(email=email, 
                            fio=fio, 
                            telephone=telephone, 
                            password=generate_password_hash(password),
                            organization = new_organization)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Аккаунт создан!', category='success')
            return redirect(url_for('views.account'))
    return render_template("sign.html", user=current_user)


@auth.route('/profile/common', methods=['GET', 'POST'])
def profile_common():
    if request.method == 'POST':
        fio = request.form.get('fio')
        telephone = request.form.get('telephone')   
        organization_full_name = request.form.get('organization_full_name')
        okpo = request.form.get('okpo')
        ynp = request.form.get('ynp')

        current_user.fio = fio
        existing_telephone = User.query.filter(User.id != current_user.id, User.telephone == telephone).first()
        if not existing_telephone:
            current_user.telephone = telephone
            db.session.commit()

            userOrganization = Organization.query.filter_by(id = current_user.organization).first()
            
            existing_full_name = Organization.query.filter(Organization.full_name == organization_full_name, Organization.id != userOrganization.id).first()
            existing_okpo = Organization.query.filter(Organization.okpo == okpo, Organization.id != userOrganization.id).first()
            existing_ynp = Organization.query.filter(Organization.ynp == ynp, Organization.id != userOrganization.id).first()
            
            if existing_full_name:
                flash('Организация c таким названием уже существует', 'error')
                return redirect(url_for('views.profile_common'))
            else:
                userOrganization.full_name = organization_full_name
                db.session.commit()
            if existing_okpo:
                flash('Организация c таким ОКПО уже существует', 'error')
                return redirect(url_for('views.profile_common'))
            else:
                userOrganization.okpo = okpo
                db.session.commit()
            if existing_ynp:
                flash('Организация c таким УНП уже существует', 'error')
                return redirect(url_for('views.profile_common'))
            else:
                userOrganization.ynp = ynp
                db.session.commit()
            db.session.commit()
            flash('Данные обновлены', 'success')
        else: 
            flash('Пользователь с таким номером телефона уже существует','error')
    return redirect(url_for('views.profile_common'))

@auth.route('/profile/password', methods=['GET', 'POST'])
def profile_password():
    if request.method == 'POST':
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        conf_new_password = request.form.get('conf_new_password')
        user = User.query.filter_by(email=current_user.email).first()
        if old_password and new_password and conf_new_password:
            if not check_password_hash(current_user.password, old_password):
                flash('Не правильный старый пароль', category='error')
                return redirect(url_for('views.my_profile'))
            elif new_password != conf_new_password:
                flash('При подтверждении пароля произошла ошибка', category='error')
                return redirect(url_for('views.my_profile'))
            else:
                user.password = generate_password_hash(conf_new_password)
                db.session.commit()
                flash('Пароль был изменен', category='success')
            
                send_email(f'Ваш пароль был изменен на {conf_new_password}', current_user.email)
                return redirect(url_for('views.login'))
        else:
            flash('Введите пароль ', category='error')
    return redirect(url_for('views.profile_password'))

@auth.route('/relod_password', methods=['GET', 'POST'])
def relod_password():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        if user:
            send_email(f'Ваш новый пароль: {gener_password()}, при желании его можно изменить в настройках профиля', email)
            flash('Новый пароль был отправлен вам на email', category='success')  
            user.password = generate_password_hash(gener_password())
            db.session.commit()
            return redirect(url_for('views.login'))
        else:   
            flash('Пользователя с таким email не существует', category='error')
            return redirect(url_for('views.relod_password'))
    return render_template("relod_password.html")

def send_email(message_body, recipient_email):
    smtp_server = 'smtp.mail.ru'
    smtp_port = 587 
    email_address = 'tw1.ofcompay@mail.ru'  
    email_password = '6McTMF3uX2chGcFchUmZ'
    message = MIMEMultipart()
    message['From'] = email_address
    message['To'] = recipient_email
    message['Subject'] = 'Оповещение пользователя'
    message.attach(MIMEText(message_body, 'plain'))
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls() 
    server.login(email_address, email_password)
    server.send_message(message)
    server.quit()

def gener_password():
    # symbols = string.digits
    # password = ''.join(random.choice(symbols) for _ in range(8))
    password = '1111'
    return password

@auth.route('/create_new_report', methods=['POST'])
def create_new_report():
    if request.method == 'POST':    
        organization_name = request.form.get('modal_organization_name')
        okpo = request.form.get('modal_organization_okpo')
        year = request.form.get('modal_report_year')
        quarter = request.form.get('modal_report_quarter')
        organization = Organization.query.filter_by(okpo = okpo, full_name=organization_name).first()
        proverka_report = Report.query.filter_by(organization_name=organization_name, year = year, quarter=quarter).first()
        if not proverka_report:
            new_report = Report(
                okpo=organization.okpo,
                organization_name= organization.full_name,
                year=year,
                quarter=quarter,
                user_id = current_user.id
            )
            db.session.add(new_report)
            db.session.commit()
            
            new_version_report = Version_report(
                begin_time = datetime.now(),
                # change_time = 
                # control = 
                # agreed = 
                # agreed_time = 
                status = "Заполнение",
                fio = current_user.fio,
                telephone = current_user.telephone,
                email = current_user.email,
                report=new_report
            )
            db.session.add(new_version_report)
            db.session.commit() 
            flash('Добавлен новый отчет', 'success')
        else:
            flash(f'Отчет {year} года {quarter} квартала уже существует', 'error')
    return redirect(url_for('views.report_area'))
    
def last_quarter():
    current_mounth = datetime.now().strftime("%m")
    if (current_mounth == '01' or current_mounth == '02' or current_mounth == '03'):
        last_quarter_value = 4
    elif (current_mounth == '04' or current_mounth == '05' or current_mounth == '06'):
        last_quarter_value = 1
    elif (current_mounth == '07' or current_mounth == '08' or current_mounth == '09'):
        last_quarter_value = 2
    else:
        last_quarter_value = 3
    return last_quarter_value
  
def year_fourMounth_ago():
    current_date = datetime.now()
    months_to_subtract = 4
    new_date = current_date - timedelta(days=months_to_subtract * 30)
    year_4_months_ago = new_date.year
    return year_4_months_ago

@auth.route('/update_report', methods=['POST'])
def update_report():
    if request.method == 'POST':
        id = request.form.get('modal_report_id')
        okpo = request.form.get('modal_report_okpo')
        year = request.form.get('modal_report_year')
        quarter = request.form.get('modal_report_quarter')  
        
        current_report = Report.query.filter_by(id = id).first()
        versions = Version_report.query.filter_by(report_id = id).all()
        organization_okpo = Organization.query.filter_by(okpo = okpo).first()

        if current_report:
            sent_version_exists = any(version.sent for version in versions)
            if sent_version_exists:
                flash('После отправки версии изменение отчета недоступно', category='error')
                return redirect(url_for('views.report_area'))  
            current_report.okpo = okpo
            current_report.year = year
            current_report.quarter = quarter
            current_report.organization_name = organization_okpo.full_name
            db.session.commit()
            flash('Параметры обновлены', category='success')
        else:
            flash('Отчет не найден', 'error')
        return redirect(url_for('views.report_area'))
    
@auth.route('/delete_report/<report_id>', methods=['POST'])
def delete_report(report_id):
    if request.method == 'POST':
        current_report = Report.query.filter_by(id = report_id).first()
        versions = Version_report.query.filter_by(report_id = report_id).all()
        tickets = Ticket.query.filter_by(version_report_id = report_id).all()  
        if current_report:   
            sent_version_exists = any(version.sent for version in versions)
            if sent_version_exists:
                flash('Присутствует отправленная версия', category='error')
                return redirect(url_for('views.report_area'))  
            for ticket in tickets:
                db.session.delete(ticket)        
            for version in versions:
                sections = Sections.query.filter_by(id_version = version.id).all()
                for section in sections:
                    db.session.delete(section)
                db.session.delete(version)
            db.session.delete(current_report)
            db.session.commit()
            flash('Отчет удален', category='success')
        return redirect(url_for('views.report_area'))
    
@auth.route('/create_new_report_version/<int:id>', methods=['POST'])
def create_new_report_version(id):
    if request.method == 'POST':
        new_version_report = Version_report(
            fio = current_user.fio,
            telephone = current_user.telephone,
            email = current_user.email,
            report_id = id 
        )
        db.session.add(new_version_report)
        db.session.commit()
        flash('Добавлена новая версия', category='success')
    return redirect(url_for('views.report_area'))

@auth.route('/delete_version/<int:id>', methods=['POST'])
def delete_version(id):
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id=id).first()
        if current_version:
            if current_version.sent == False:
                versions_currentReport = Version_report.query.filter_by(report_id=current_version.report_id).all()
                if len(versions_currentReport) > 1:
                    sections = Sections.query.filter_by(id_version=id).all()
                    tickets = Ticket.query.filter_by(version_report_id=id).all()
                    for section in sections:
                        db.session.delete(section)
                    for ticket in tickets:
                        db.session.delete(ticket)
                    db.session.delete(current_version)
                    db.session.commit()
                    flash('Версия удалена', category='success')
                else:
                    flash('Единственная версия не может быть удалена', category='error')
            else:
                flash('Отправленная версия не может быть удалена', category='error')
        else:
            flash('Версия не найдена', category='error')
    return redirect(url_for('views.report_area'))

@auth.route('/add_section_param', methods=['POST'])
def add_section_param():
    if request.method == 'POST':
        current_version_id = request.form.get('current_version')
        name = request.form.get('name_of_product')
        id_product = request.form.get('add_id_product')
        oked = request.form.get('oked')
        produced = request.form.get('produced')
        Consumed_Quota = request.form.get('Consumed_Quota')
        Consumed_Fact = request.form.get('Consumed_Fact')
        Consumed_Total_Quota = request.form.get('Consumed_Total_Quota')
        Consumed_Total_Fact = request.form.get('Consumed_Total_Fact')
        note = request.form.get('note')
        section_number = request.form.get('section_number')
        
        produced = Decimal(produced) if produced else Decimal(0)
        Consumed_Quota = Decimal(Consumed_Quota) if Consumed_Quota else Decimal(0)
        Consumed_Fact = Decimal(Consumed_Fact) if Consumed_Fact else Decimal(0)
        Consumed_Total_Quota = Decimal(Consumed_Total_Quota) if Consumed_Total_Quota else Decimal(0)
        Consumed_Total_Fact = Decimal(Consumed_Total_Fact) if Consumed_Total_Fact else Decimal(0)

        current_version = Version_report.query.filter_by(id=current_version_id).first()
        current_product = DirProduct.query.filter_by(NameProduct=name, IdProduct=id_product).first()
        product_unit = DirUnit.query.filter_by(IdUnit=current_product.IdUnit).first() if current_product else None
        if current_version:
            if not current_version.sent:
                if current_product:
                    proverka_section = Sections.query.filter_by(id_version=current_version_id, section_number=section_number, id_product=current_product.IdProduct).first()
                    if proverka_section:
                        flash('Такой вид продукции уже существует', 'error')
                        return redirect(url_for('views.report_fuel', id=current_version_id))
                    else:
                        new_section = Sections(
                            id_version=current_version_id,
                            id_product=current_product.IdProduct,
                            code_product=current_product.CodeProduct,
                            section_number=section_number,
                            Oked=oked,
                            produced=produced,
                            Consumed_Quota=Consumed_Quota,
                            Consumed_Fact=Consumed_Fact,
                            Consumed_Total_Quota=Consumed_Total_Quota,
                            Consumed_Total_Fact=Consumed_Total_Fact,
                            total_differents=None,
                            note=note
                        )
                        db.session.add(new_section)
                        db.session.commit()
                        current_section = Sections.query.filter_by(id=new_section.id, section_number=section_number).first()

                        if current_section.code_product == 7000:
                            current_section.total_differents = current_section.Consumed_Total_Fact - current_section.Consumed_Total_Quota
                            db.session.commit()
                        else:
                            try:
                                if current_section.produced != 0:
                                    if product_unit and (product_unit.NameUnit == '%' or product_unit.NameUnit == '% (включая покупную)'):
                                        current_section.Consumed_Fact = round((current_section.Consumed_Total_Fact / current_section.produced) * 100, 2)
                                    else:
                                        current_section.Consumed_Fact = round((current_section.Consumed_Total_Fact / current_section.produced) * 1000, 2)
                                else:
                                    current_section.Consumed_Fact = 0

                                if current_section.Consumed_Quota != 0:
                                    if product_unit and (product_unit.NameUnit == '%' or product_unit.NameUnit == '% (включая покупную)'):
                                        current_section.Consumed_Total_Quota = round((current_section.produced / current_section.Consumed_Quota) * 100, 2)
                                    else:
                                        current_section.Consumed_Total_Quota = round((current_section.produced / current_section.Consumed_Quota) * 1000, 2)
                                else:
                                    current_section.Consumed_Total_Quota = 0
                                current_section.total_differents = current_section.Consumed_Total_Fact - current_section.Consumed_Total_Quota
                                db.session.commit()
                            except InvalidOperation as e:
                                flash(f"Ошибка при вычислениях: {e}")

                        specific_codes = ['9001', '9010', '9100']
                        section9001 = Sections.query.filter_by(id_version=current_version_id, section_number=section_number, code_product='9001').first()
                        aggregated_values = db.session.query(
                            func.sum(Sections.Consumed_Total_Quota),
                            func.sum(Sections.Consumed_Total_Fact),
                            func.sum(Sections.total_differents)
                        ).filter(
                            Sections.id_version == current_version_id,
                            Sections.section_number == section_number,
                            ~Sections.code_product.in_(specific_codes)
                        ).first()

                        if section9001 and aggregated_values:
                            section9001.Consumed_Total_Quota, section9001.Consumed_Total_Fact, section9001.total_differents = aggregated_values
                            db.session.commit()

                        section9010 = Sections.query.filter_by(id_version=current_version_id, section_number=section_number, code_product='9010').first()
                        section9100 = Sections.query.filter_by(id_version=current_version_id, section_number=section_number, code_product='9100').first()

                        if section9100 and section9001 and section9010:
                            section9100.Consumed_Total_Quota = section9001.Consumed_Total_Quota + section9010.Consumed_Total_Quota
                            section9100.Consumed_Total_Fact = section9001.Consumed_Total_Fact + section9010.Consumed_Total_Fact
                            section9100.total_differents = section9001.total_differents + section9010.total_differents
                            db.session.commit()
                    
                        if current_version:
                            current_version.change_time = datetime.now()
                            db.session.commit()
                    flash('Продукция была добавлена', 'success')
                    current_version.status = "Заполнение"
                    current_version.control = False
                    current_version.agreed = False
                    current_version.agreed_time = None
                    db.session.commit()
                else:
                    flash('Выбирите вид продукции из выпадающего списка', 'error')
            else:
                flash('Редактирование отправленной версии недоступно', 'error')
        else:
            flash('Версия не найдена', 'error') 
    if section_number == '1':
        return redirect(url_for('views.report_fuel', id=current_version_id))
    elif section_number == '2':
        return redirect(url_for('views.report_heat', id=current_version_id))
    elif section_number == '3':
        return redirect(url_for('views.report_electro', id=current_version_id))

@auth.route('/change_section', methods=['POST'])
def change_section():
    if request.method == 'POST':
        id_version = request.form.get('current_version')
        id_fuel = request.form.get('id')
        produced = request.form.get('produced')
        Consumed_Quota = request.form.get('Consumed_Quota')     
        Consumed_Fact = request.form.get('Consumed_Fact')
        Consumed_Total_Quota = request.form.get('Consumed_Total_Quota')
        Consumed_Total_Fact = request.form.get('Consumed_Total_Fact')
        note = request.form.get('note')

        produced = Decimal(produced) if produced else Decimal(0)
        Consumed_Quota = Decimal(Consumed_Quota) if Consumed_Quota else Decimal(0)
        Consumed_Fact = Decimal(Consumed_Fact) if Consumed_Fact else Decimal(0)
        Consumed_Total_Quota = Decimal(Consumed_Total_Quota) if Consumed_Total_Quota else Decimal(0)
        Consumed_Total_Fact = Decimal(Consumed_Total_Fact) if Consumed_Total_Fact else Decimal(0)

        current_version = Version_report.query.filter_by(id=id_version).first() 
        current_section = Sections.query.filter_by(id=id_fuel).first()
        
        if current_version:
            if current_version.sent == False:
                if current_section:
                    if (current_section.code_product == 7000):
                        current_section.Consumed_Total_Quota = Consumed_Total_Quota
                        current_section.Consumed_Total_Fact = Consumed_Total_Fact
                        current_section.note = note
                        db.session.commit()

                        current_section.total_differents = current_section.Consumed_Total_Fact - current_section.Consumed_Total_Quota
                        db.session.commit()
                    else:
                        current_section.produced = produced
                        current_section.Consumed_Quota = Consumed_Quota
                        
                        current_section.Consumed_Total_Fact = Consumed_Total_Fact
                        current_section.note = note 
                        db.session.commit()
                        
                        if current_section.produced != 0:
                            current_section.Consumed_Fact = round((current_section.Consumed_Total_Fact / current_section.produced) * 1000, 2)
                        else:
                            current_section.Consumed_Fact = 0.00

                        if current_section.Consumed_Quota != 0:
                            current_section.Consumed_Total_Quota = round((current_section.produced / current_section.Consumed_Quota) * 1000, 2)
                        else:
                            current_section.Consumed_Total_Quota = 0.00
                        db.session.commit()

                        current_section.total_differents = current_section.Consumed_Total_Fact - current_section.Consumed_Total_Quota
                        db.session.commit()
                
                    if current_version:
                        current_version.change_time = datetime.now()
                        db.session.commit()

                    specific_codes = ['9001', '9010', '9100']

                    section9001 = Sections.query.filter_by(id_version=id_version, section_number=current_section.section_number, code_product=9001).first()
                    aggregated_values = db.session.query(
                        func.sum(Sections.Consumed_Total_Quota),
                        func.sum(Sections.Consumed_Total_Fact),
                        func.sum(Sections.total_differents)
                    ).filter(
                        Sections.id_version == id_version,
                        Sections.section_number == current_section.section_number,
                        ~Sections.code_product.in_(specific_codes)
                    ).first()

                    if aggregated_values:
                        section9001.Consumed_Total_Quota = aggregated_values[0] or 0
                        section9001.Consumed_Total_Fact = aggregated_values[1] or 0
                        section9001.total_differents = aggregated_values[2] or 0
                        db.session.commit()

                    section9010 = Sections.query.filter_by(id_version=id_version, section_number=current_section.section_number, code_product=9010).first()
                    section9100 = Sections.query.filter_by(id_version=id_version, section_number=current_section.section_number, code_product=9100).first()

                    if section9100 and section9001 and section9010:
                        section9100.Consumed_Total_Quota = (section9001.Consumed_Total_Quota or 0) + (section9010.Consumed_Total_Quota or 0)
                        section9100.Consumed_Total_Fact = (section9001.Consumed_Total_Fact or 0) + (section9010.Consumed_Total_Fact or 0)
                        section9100.total_differents = (section9001.total_differents or 0) + (section9010.total_differents or 0)
                        db.session.commit()
                    current_version.status = "Заполнение"
                    current_version.control = False
                    current_version.agreed = False
                    current_version.agreed_time = None
                    db.session.commit()
                    flash('Параметры обновлены', 'success')
                else:
                    flash('Ошибка при обновлении', 'error')   
            else:
                flash('Редактирование отправленной версии недоступно', 'error')
        else:
            flash('Версия не найдена', 'error')

        if(current_section.section_number == 1):
            return redirect(url_for('views.report_fuel', id=id_version))
        elif(current_section.section_number == 2):
            return redirect(url_for('views.report_heat', id=id_version))
        elif(current_section.section_number == 3):
            return redirect(url_for('views.report_electro', id=id_version))  

@auth.route('/remove_section/<id>', methods=['POST'])
def remove_section(id):
    if request.method == 'POST':
        delete_section = Sections.query.filter_by(id=id).first()
        id_version = delete_section.id_version
        section_numberDELsection = delete_section.section_number
        current_version = Version_report.query.filter_by(id=id_version).first() 

        if current_version:
            if current_version.sent == False:
                if delete_section:
                    section9001 = Sections.query.filter_by(id_version=id_version, section_number = section_numberDELsection, code_product = 9001).first()
                    section9001.Consumed_Total_Quota -= delete_section.Consumed_Total_Quota
                    section9001.Consumed_Total_Fact -= delete_section.Consumed_Total_Fact
                    section9001.total_differents -= delete_section.total_differents

                    section9100 = Sections.query.filter_by(id_version=id_version, section_number = section_numberDELsection, code_product = 9100).first()
                    section9100.Consumed_Total_Quota -= delete_section.Consumed_Total_Quota
                    section9100.Consumed_Total_Fact -= delete_section.Consumed_Total_Fact
                    section9100.total_differents -= delete_section.total_differents

                    db.session.delete(delete_section)
                    db.session.commit()
                    flash('Продукция была удалена', 'success')
                    if current_version:
                        current_version.change_time = datetime.now()
                        db.session.commit()
                    current_version.status = "Заполнение"
                    current_version.control = False
                    current_version.agreed = False
                    current_version.agreed_time = None
                    db.session.commit()
                else: 
                    flash('Ошибка при удалении', 'error')
            else: 
                flash('Редактирование отправленной версии недоступно', 'error')      
        else:
            flash('Версия не найдена', 'error')

        if(section_numberDELsection == 1):
            return redirect(url_for('views.report_fuel', id=id_version))
        elif(section_numberDELsection == 2):
            return redirect(url_for('views.report_heat', id=id_version))
        elif(section_numberDELsection == 3):
            return redirect(url_for('views.report_electro', id=id_version))
        
@auth.route('/control_version/<id>', methods=['POST'])
def control_version(id):
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id=id).first()
        id_version = current_version.id
        fuel_section9010 = Sections.query.filter_by(id_version=id, section_number=1, code_product=9010).first()
        heat_section9010 = Sections.query.filter_by(id_version=id, section_number=2, code_product=9010).first()
        electro_section9010 = Sections.query.filter_by(id_version=id, section_number=3, code_product=9010).first()    

        if current_version.status == "Заполнение": 
            if fuel_section9010 is None or heat_section9010 is None or electro_section9010 is None:
                if fuel_section9010 is None:
                    flash('Код строки 9010 не заполнен', 'error')
                    return redirect(url_for('views.report_fuel', id=id_version))
                if heat_section9010 is None:
                    flash('Код строки 9010 не заполнен', 'error')
                    return redirect(url_for('views.report_heat', id=id_version))
                if electro_section9010 is None:
                    flash('Код строки 9010 не заполнен', 'error')
                    return redirect(url_for('views.report_electro', id=id_version))
            
            if not fuel_section9010.note:
                flash('Код строки 9010 не заполнен', 'error')
                return redirect(url_for('views.report_fuel', id=id_version))
            elif not heat_section9010.note:
                flash('Код строки 9010 не заполнен', 'error')
                return redirect(url_for('views.report_heat', id=id_version))
            elif not electro_section9010.note:
                flash('Код строки 9010 не заполнен', 'error')
                return redirect(url_for('views.report_electro', id=id_version))
            current_version.status = 'Контроль пройден'
            current_version.control = True
            db.session.commit()
            flash('Контроль пройден', 'successful')
        else:
            flash('Контроль уже был пройден', 'successful')
        return redirect(url_for('views.report_area'))
    
@auth.route('/agreed_version/<id>', methods=['POST'])
def agreed_version(id):
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id=id).first()
        if current_version.status == 'Контроль пройден': 
            current_version.agreed = True
            current_version.agreed_time = datetime.now()          
            current_version.status = 'Согласовано'

            db.session.commit()
            flash('Версия согласована', 'successful')
        else:
            flash('Необходимо пройти контроль', 'error')
        return redirect(url_for('views.report_area'))
    
@auth.route('/sent_version/<id>', methods=['POST'])
def sent_version(id):
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id=id).first()

        if current_version.status == 'Согласовано':
            current_version.status = 'Отправлено'
            current_version.sent = True
            db.session.commit()
            flash('Версия отправлена', 'successful')

            user_message = Message(
                text = f"Статус версии: №{current_version.id}, был изменен на '{current_version.status}'",
                user = current_user
            )

            db.session.add(user_message)
            db.session.commit()

        else:
            flash('Необходимо согласовать', 'error')




        return redirect(url_for('views.report_area'))
    
@auth.route('/change_category_report', methods=['POST'])
def change_category_report():
    action = request.form.get('action')
    report_id = request.form.get('reportId')
    
    status_itog = None
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id=report_id).first()
        link_return = current_version.status
        if current_version:
            if action == 'not_viewed':
                status_itog = 'Отправлено'
            elif action == 'remarks':
                status_itog = 'Есть замечания'
            elif action == 'to_download':
                status_itog = 'Готов к загрузке'
            elif action == 'to_delete':
                status_itog = 'Готов к удалению'

            current_version.status = status_itog
            db.session.commit()

            flash('Отчет был перемещен', 'success')
            if link_return == 'Отправлено':
                return redirect(url_for('views.audit_not_viewed'))
            elif link_return == 'Есть замечания':
                return redirect(url_for('views.audit_remarks'))
            elif link_return == 'Готов к загрузке':
                return redirect(url_for('views.audit_to_download'))
            elif link_return == 'Готов к удалению':
                return redirect(url_for('views.audit_to_delete'))


@auth.route('/send_comment', methods=['POST'])
def send_comment():
    if request.method == 'POST':
        version_id = request.form.get('version_id')
        resp_email = request.form.get('resp_email')
        text = request.form.get('text')
        cleaned_text = ' '.join(text.split())

        current_version = Version_report.query.filter_by(id=version_id).first()

        if current_version:
            new_comment = Ticket(
                # begin_time = 
                # luck = 
                note = cleaned_text,
                version_report_id = current_version.id
            )

            db.session.add(new_comment)
            db.session.commit()

            flash('Комментарий создан', 'success')
        else:
            flash('Версия не найдена', 'error')

        return redirect(url_for('views.audit_to_delete'))














@auth.route('/export_table', methods=['POST'])
def export_table():
    if request.method == 'POST':
        version_id = int(request.form.get('version_id'))
        numb_section = int(request.form.get('numb_section'))
        
        sections = Sections.query.filter_by(id_version=version_id, section_number=numb_section).order_by(desc(Sections.id)).all()
        unit_header_one_text = ''
        unit_header_all_text = ''

        if numb_section == 1:
            unit_header_one_text = 'кг у.т.'
            unit_header_all_text = 'т у.т.'
        elif numb_section == 2:
            unit_header_one_text = 'Мкал'
            unit_header_all_text = 'Гкал'
        else:
            unit_header_one_text = 'кВтч'
            unit_header_all_text = 'тыс.кВтч'

        wb = Workbook()
        ws = wb.active
        ws.title = "Table"

        # Настройка заголовков
        merged_cells = {
            'A1:A2': "Наименование вида продукции (работ услуг)",
            'B1:B2': "Код строки",
            'C1:C2': "Код по ОКЭД",
            'D1:D2': "Единица измерения",
            'E1:E2': "Произведено продукции (работ, услуг) за отчетный период",
            'F1:G1': f"Израсходовано на единицу продукции (работы, услуги) за отчетный период, {unit_header_one_text}",
            'H1:J1': f"Израсходовано на всю произведенную продукцию (работу, услугу) за отчетный период,  {unit_header_all_text}",
            'K1:K2': "Примечание",
            'J1': "Экономия(-), перерасход(+)",
            'F2': "по утвержденной норме (предельному уровню)",
            'G2': "фактически",
            'H2': "по утвержденной норме (предельному уровню)",
            'I2': "фактически",
            'J2': "Экономия(-), перерасход(+)",
            'A3': "A",
            'B3': "Б",
            'C3': "В",
            'D3': "Г",
            'E3': "1",
            'F3': "2",
            'G3': "3",
            'H3': "4",
            'I3': "5",
            'J3': "6",
            'K3': "7"
        }


        font = Font(name='Times New Roman', size=12)
        alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        border = Border(
            left=Side(border_style="thin"),
            right=Side(border_style="thin"),
            top=Side(border_style="thin"),
            bottom=Side(border_style="thin")
        )


        for cell_range, text in merged_cells.items():
            top_left_cell = cell_range.split(':')[0]
            ws[top_left_cell] = text
            ws[top_left_cell].font = font
            ws[top_left_cell].alignment = alignment
            ws[top_left_cell].border = border

        for cell_range in merged_cells.keys():
            ws.merge_cells(cell_range)

        column_widths = {
            'A': 30,
            'B': 15,
            'C': 15,
            'D': 20,
            'E': 50,
            'F': 40,
            'G': 40,
            'H': 40,
            'I': 40,
            'J': 30,
            'K': 20
        }
        row_heights = {
            1: 30,
            2: 30,
            3: 25
        }

        for col, width in column_widths.items():
            ws.column_dimensions[col].width = width

        for row, height in row_heights.items():
            ws.row_dimensions[row].height = height


        row_index = 4  # с 4-й строки, чтобы не перезаписать заголовки
        for section in sections:
            ws[f'A{row_index}'] = section.product.NameProduct
            ws[f'B{row_index}'] = section.code_product
            ws[f'C{row_index}'] = section.Oked
            ws[f'D{row_index}'] = section.product.unit.NameUnit
            ws[f'E{row_index}'] = section.produced
            ws[f'F{row_index}'] = section.Consumed_Quota
            ws[f'G{row_index}'] = section.Consumed_Fact
            ws[f'H{row_index}'] = section.Consumed_Total_Quota
            ws[f'I{row_index}'] = section.Consumed_Total_Fact
            ws[f'J{row_index}'] = section.total_differents
            ws[f'K{row_index}'] = section.note

            for col in column_widths.keys():
                cell = ws[f'{col}{row_index}']
                cell.border = border

            row_index += 1

        output = BytesIO()
        wb.save(output)
        output.seek(0)
        
        return send_file(output, as_attachment=True, download_name='table_report.xlsx', mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')