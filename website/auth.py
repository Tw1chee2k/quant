from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from .models import User, Organization, Report, Version_report, DirUnit, DirProduct, Sections, Ticket
from . import db
from flask_login import login_user, logout_user, current_user, LoginManager, login_required
from sqlalchemy import func
from werkzeug.security import check_password_hash, generate_password_hash
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import re
import random
import string
from decimal import Decimal, InvalidOperation

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
                            organization_id = new_organization.id)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Аккаунт создан!', category='success')
            return redirect(url_for('views.account'))
    return render_template("sign.html", user=current_user)

@auth.route('/profile/password', methods=['GET', 'POST'])
def profile_password():
    if request.method == 'POST':
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        conf_new_password = request.form.get('conf_new_password')
        user = User.query.filter_by(email=current_user.email).first()
        if not check_password_hash(current_user.password, old_password):
            flash('Не правильный старый пароль', category='error')
            return redirect(url_for('views.my_profile'))
        elif new_password != conf_new_password:
            flash('При подтверждении пароля произошла ошибка', category='error')
            return redirect(url_for('views.my_profile'))
        else:
            user.password = generate_password_hash(conf_new_password)
            db.session.commit()
            flash('Изменение пароля произошло успешно!', category='success')
          
            send_email(f'Ваш пароль был изменен на {conf_new_password}', current_user.email)
            return redirect(url_for('views.login'))
    return render_template("views.profile_password", user=current_user)

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
    organization = Organization.query.filter_by(id = current_user.organization_id).first()
    if request.method == 'POST':
        new_report = Report(
            okpo=organization.okpo,
            organization_name= organization.full_name,
            year=2024,
            quarter=1,
            user_id = current_user.id,
            organization_id = organization.id
        )
        db.session.add(new_report)
        db.session.commit()
        flash('Добавлен новый отчет', category='success')
        
        new_version_report = Version_report(
            begin_time = datetime.now(),
            # change_time = 
            # control = 
            # agreed = 
            # agreed_time = 
            fio = current_user.fio,
            telephone = current_user.telephone,
            email = current_user.email,
            report_id = new_report.id
        )
        db.session.add(new_version_report)
        db.session.commit() 
    return redirect(url_for('views.report_area'))
    
@auth.route('/update_report', methods=['POST'])
def update_report():
    id = request.form.get('modal_report_id')
    okpo = request.form.get('modal_report_okpo')
    year = request.form.get('modal_report_year')
    quarter = request.form.get('modal_report_quarter')    

    current_report = Report.query.filter_by(id = id).first()
    organization_okpo = Organization.query.filter_by(okpo = okpo).first()
    
    if request.method == 'POST':
        current_report.okpo = okpo
        current_report.year = year
        current_report.quarter = quarter
        current_report.organization_name = organization_okpo.full_name
        current_report.organization_id = organization_okpo.id
        db.session.commit()
        return redirect(url_for('views.report_area'))
    
@auth.route('/delete_report/<report_id>', methods=['POST'])
def delete_report(report_id):
    if request.method == 'POST':
        current_report = Report.query.filter_by(id = report_id).first()
        versions = Version_report.query.filter_by(report_id = report_id).all()
        tickets = Ticket.query.filter_by(version_report_id = report_id).all()  
        if current_report:     
            for ticket in tickets:
                db.session.delete(ticket)        
            for version in versions:
                sections = Sections.query.filter_by(id_version = version.id).all()
                for section in sections:
                    db.session.delete(section)
                
                db.session.delete(version)
            db.session.delete(current_report)
            db.session.commit()
            flash("Отчет был удален")
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
        flash('Добавлена новая версия отчета', category='success')
    return redirect(url_for('views.report_area'))

@auth.route('/delete_version/<id>', methods=['POST'])
def delete_version(id):
    if request.method == 'POST':
        current_version = Version_report.query.filter_by(id = id).first()
        sections = Sections.query.filter_by(id_version = id).all()
        tickets = Ticket.query.filter_by(version_report_id = id).all()
        if current_version:
            for section in sections:
                db.session.delete(section)
            for ticket in tickets:
                db.session.delete(ticket)
            db.session.delete(current_version)
            db.session.commit()
            flash("Версия была удалена")
        return redirect(url_for('views.report_area'))
    

@auth.route('/add_fuel_param', methods=['POST'])
def add_fuel_param():
    if request.method == 'POST':
        current_version = request.form.get('current_version')
        name = request.form.get('name_of_product')
        oked = request.form.get('oked')
        produced = request.form.get('produced')
        Consumed_Quota = request.form.get('Consumed_Quota')
        Consumed_Fact = request.form.get('Consumed_Fact')
        Consumed_Total_Quota = request.form.get('Consumed_Total_Quota')
        Consumed_Total_Fact = request.form.get('Consumed_Total_Fact')
        note = request.form.get('note')

        # Преобразование значений в Decimal
        produced = Decimal(produced) if produced else Decimal(0)
        Consumed_Quota = Decimal(Consumed_Quota) if Consumed_Quota else Decimal(0)
        Consumed_Fact = Decimal(Consumed_Fact) if Consumed_Fact else Decimal(0)
        Consumed_Total_Quota = Decimal(Consumed_Total_Quota) if Consumed_Total_Quota else Decimal(0)
        Consumed_Total_Fact = Decimal(Consumed_Total_Fact) if Consumed_Total_Fact else Decimal(0)

        current_product = DirProduct.query.filter_by(NameProduct=name).first()
        proverka_section = Sections.query.filter_by(id_version=current_version, section_number=1, id_product=current_product.IdProduct).first()
        if proverka_section:
            flash('Такой вид продукции уже существует')
        else:
            new_section = Sections(
                id_version=current_version,
                id_product=current_product.IdProduct,
                code_product=current_product.CodeProduct,
                section_number=1,
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

            current_section = Sections.query.filter_by(id=new_section.id, section_number=1).first()
            try:
                # Проверка деления на ноль
                if current_section.produced != 0:
                    current_section.Consumed_Fact = round((current_section.Consumed_Total_Fact / current_section.produced) * 1000, 2)
                else:
                    current_section.Consumed_Fact = 0

                if current_section.Consumed_Quota != 0:
                    current_section.Consumed_Total_Quota = round((current_section.produced / current_section.Consumed_Quota) * 1000, 2)
                else:
                    current_section.Consumed_Total_Quota = 0

                current_section.total_differents = current_section.Consumed_Total_Fact - current_section.Consumed_Total_Quota
                db.session.commit()
            except InvalidOperation as e:
                flash(f"Ошибка при вычислениях: {e}")

            specific_codes = ['9001', '9010', '9100']

            section9001 = Sections.query.filter_by(id_version=current_version, section_number=1, code_product='9001').first()
            aggregated_values = db.session.query(
                func.sum(Sections.Consumed_Total_Quota),
                func.sum(Sections.Consumed_Total_Fact),
                func.sum(Sections.total_differents)
            ).filter(
                Sections.id_version == current_version,
                Sections.section_number == 1,
                ~Sections.code_product.in_(specific_codes)
            ).first()

            if section9001 and aggregated_values:
                section9001.Consumed_Total_Quota, section9001.Consumed_Total_Fact, section9001.total_differents = aggregated_values
                db.session.commit()

            section9010 = Sections.query.filter_by(id_version=current_version, section_number=1, code_product='9010').first()
            section9100 = Sections.query.filter_by(id_version=current_version, section_number=1, code_product='9100').first()

            if section9100 and section9001 and section9010:
                section9100.Consumed_Total_Quota = section9001.Consumed_Total_Quota + section9010.Consumed_Total_Quota
                section9100.Consumed_Total_Fact = section9001.Consumed_Total_Fact + section9010.Consumed_Total_Fact
                section9100.total_differents = section9001.total_differents + section9010.total_differents
                db.session.commit()

        return redirect(url_for('views.report_fuel', id=current_version))
    
@auth.route('/change_fuel', methods=['POST'])
def change_fuel():
    if request.method == 'POST':
        id_version = request.form.get('current_version')
        id_fuel = request.form.get('id')
        produced = request.form.get('produced')
        Consumed_Quota = request.form.get('Consumed_Quota')
        Consumed_Total_Fact = request.form.get('Consumed_Total_Fact')
        note = request.form.get('note')

        current_section = Sections.query.filter_by(id=id_fuel, section_number=1,).first() 
        if current_section:
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

            current_section.total_differents=current_section.Consumed_Total_Fact-current_section.Consumed_Total_Quota
            
            db.session.commit()
      
            current_version = Version_report.query.filter_by(id=id_version).first()
            if current_version:
                current_version.change_time = datetime.now()
                db.session.commit()

            specific_codes = ['9001', '9010', '9100']

            section9001 = Sections.query.filter_by(id_version=id_version, section_number=1, code_product=9001).first()
            aggregated_values = db.session.query(
                func.sum(Sections.Consumed_Total_Quota),
                func.sum(Sections.Consumed_Total_Fact),
                func.sum(Sections.total_differents)
            ).filter(
                Sections.id_version == id_version,
                Sections.section_number == 1,
                ~Sections.code_product.in_(specific_codes)
            ).first()

            section9001.Consumed_Total_Quota, section9001.Consumed_Total_Fact, section9001.total_differents = aggregated_values
            db.session.commit()

            section9010 = Sections.query.filter_by(id_version=id_version, section_number=1, code_product = 9010).first()
            section9100 = Sections.query.filter_by(id_version=id_version, section_number=1, code_product = 9100).first()
            
            section9100.Consumed_Total_Quota = section9001.Consumed_Total_Quota + section9010.Consumed_Total_Quota
            section9100.Consumed_Total_Fact = section9001.Consumed_Total_Fact + section9010.Consumed_Total_Fact
            section9100.total_differents = section9001.total_differents + section9010.total_differents
            db.session.commit() 

            flash("Параметры обновлены")
        else:
            flash("фатал")
    return redirect(url_for('views.report_fuel', id=id_version))

@auth.route('/remove_fuel/<id>', methods=['POST'])
def remove_fuel(id):
    if request.method == 'POST':
        delete_section = Sections.query.filter_by(id=id).first()
        id_version = delete_section.id_version
        if delete_section:
            section9001 = Sections.query.filter_by(id_version=id_version, section_number = 1, code_product = 9001).first()
            section9001.Consumed_Total_Quota -= delete_section.Consumed_Total_Quota
            section9001.Consumed_Total_Fact -= delete_section.Consumed_Total_Fact
            section9001.total_differents -= delete_section.total_differents

            section9100 = Sections.query.filter_by(id_version=id_version, section_number = 1, code_product = 9100).first()
            section9100.Consumed_Total_Quota -= delete_section.Consumed_Total_Quota
            section9100.Consumed_Total_Fact -= delete_section.Consumed_Total_Fact
            section9100.total_differents -= delete_section.total_differents

            db.session.delete(delete_section)
            db.session.commit()

        return redirect(url_for('views.report_fuel', id=id_version))