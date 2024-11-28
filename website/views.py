from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from .models import User, Organization, Report, Version_report, Ticket, DirUnit, DirProduct, Sections, Message, News
from . import db
from sqlalchemy import asc, or_, desc
from functools import wraps
from datetime import datetime
from sqlalchemy.sql import func, or_
from sqlalchemy.types import String


views = Blueprint('views', __name__)
year_today = datetime.now().year
current_day = datetime.now().day
current_time = datetime.now()

def owner_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        version_id = kwargs.get('id')
        version = Version_report.query.get(version_id)
        if version is None:
            flash('Версия отчета не найдена.', 'error')
            return redirect(url_for('views.report_area', user=current_user))
        report = version.report
        if report.user_id != current_user.id and current_user.type != 'Администратор' and current_user.type != 'Аудитор':
            flash('Недостаточно прав для доступа к этой версии', 'error')
            return redirect(url_for('views.report_area', user=current_user))
        return f(*args, **kwargs)
    return decorated_function

def profile_complete(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.fio or not current_user.telephone or not current_user.organization_id:
            flash('Пожалуйста, заполните все обязательные поля.', 'error')
            return redirect(url_for('views.profile_common'))
        return f(*args, **kwargs)
    return decorated_function

def auditors_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.type not in ['Аудитор', 'Администратор']:
            flash('У вас нет прав доступа', 'error')
            return redirect(url_for('views.profile_common'))
        return f(*args, **kwargs)
    return decorated_function

@views.route('/')
def beginPage():
    user_data = User.query.count()
    organization_data = Organization.query.count()
    report_data = Report.query.count()
    latest_news = News.query.order_by(desc(News.id)).first()
    return render_template('beginPage.html', 
                           latest_news=latest_news,
                           user=current_user, 
                           user_data = user_data, 
                           organization_data = organization_data, 
                           report_data = report_data
                           )

@views.route('/not_found')
def not_found():
    return render_template('not_found.html')

@views.route('/sign')
def sign():
    return render_template('sign.html', 
                           user=current_user
                           )

@views.route('/login')
def login():
    return render_template('login.html', user=current_user)

@views.route('/kod')
def kod():
    return render_template('kod.html', user=current_user)

@views.route('/account')
@login_required
def account():
    messages = Message.query.filter_by(user=current_user).order_by(Message.id.desc()).all()
    return render_template('account.html', 
                           year_today=year_today,
                           current_user=current_user, 
                           messages=messages)

@views.route('/profile/common')
@login_required
def profile_common():
    count_reports = Report.query.filter_by(user_id=current_user.id).count()
    organizations = Organization.query.filter_by().all()
    return render_template('profile_common.html', 
                        user=current_user, 
                        organization=organizations,
                        count_reports=count_reports
                        )

@views.route('/profile/password')
@login_required
def profile_password():
    return render_template('profile_password.html', user=current_user)

@views.route('/report_area')
@profile_complete
@login_required
def report_area():
    if Report.query.count() == 0:  
        report_data = [
            (current_user.organization.okpo, current_user.organization.full_name, year, 1, current_user.id)
            for year in range(2024, 2044)
        ]

        reports = [
            Report(
                okpo=data[0],
                organization_name=data[1],
                year=data[2],
                quarter=data[3],
                user_id=data[4],
            )
            for data in report_data
        ]
        db.session.add_all(reports)

        version_data = [
            ('Отправлен', current_user.fio, current_user.telephone, current_user.email, i, current_time, current_time)
            for i in range(1, 21)
        ]

        versions = [
            Version_report(
                status=vers[0],
                fio=vers[1],
                telephone=vers[2],
                email=vers[3],
                report_id=vers[4],
                sent_time=vers[5],
                change_time=vers[6]
            )
            for vers in version_data
        ]
        db.session.add_all(versions)
        db.session.commit()


    report = Report.query.filter_by(user_id=current_user.id).order_by(Report.year.asc(), Report.quarter.asc()).all()


    version = Version_report.query.filter_by().all()

    for rep in report:
        rep.versions = Version_report.query.filter_by(report_id=rep.id).all()
        for version in rep.versions:
            version.tickets = Ticket.query.filter_by(version_report_id=version.id).all()

    organization = Organization.query.filter_by(id=current_user.organization.id).all()
    
    dirUnit = DirUnit.query.filter_by().all()
    dirProduct = DirProduct.query.filter_by().all()
    
    for row in dirProduct:
        current_unit = DirUnit.query.filter_by(IdUnit=row.IdUnit).first()
        row.IdUnit = current_unit.NameUnit

    year_today = datetime.now().year
    return render_template('report_area.html',
                           year_today=year_today,
                           report=report,
                           user=current_user,
                           dirUnit=dirUnit,
                           dirProduct=dirProduct,
                           organization=organization,
                           version=version)

@views.route('/report_area/<string:report_type>/<int:id>')
@profile_complete
@login_required
@owner_only
def report_section(report_type, id):
    dirUnit = DirUnit.query.all()
    current_version = Version_report.query.filter_by(id=id).first()
    current_report = Report.query.filter_by(id=current_version.report_id).first()
    report_config = {
        'fuel': {'section_number': 1, 'product_filter': DirProduct.IsFuel},
        'heat': {'section_number': 2, 'product_filter': DirProduct.IsHeat},
        'electro': {'section_number': 3, 'product_filter': DirProduct.IsElectro},
    }

    if report_type not in report_config:
        return render_template('views.not_found', error='Ошибка при выборе типа отчета')

    config = report_config[report_type]
    section_number = config['section_number']
    product_filter = config['product_filter']

    dirProduct = DirProduct.query.filter(
        product_filter == True,
        ~DirProduct.CodeProduct.in_(['9001', '9010', '9100'])
    ).order_by(asc(DirProduct.CodeProduct)).all()

    sections = Sections.query.filter_by(id_version=current_version.id, section_number=section_number).all()

    if not sections:
        sections_data = [
            (id, 288, 9100, section_number, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, ''),
            (id, 285, 9010, section_number, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, ''),
            (id, 282, 9001, section_number, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, ''),
        ]

        for data in sections_data:
            section = Sections(
                id_version=data[0],
                id_product=data[1],
                code_product=data[2],
                section_number=data[3],
                Oked=data[4],
                produced=data[5],
                Consumed_Quota=data[6],
                Consumed_Fact=data[7],
                Consumed_Total_Quota=data[8],
                Consumed_Total_Fact=data[9],
                total_differents=data[10],
                note=data[11]
            )
            db.session.add(section)
        db.session.commit()
    
    sections = Sections.query.filter_by(id_version=current_version.id, section_number=section_number).order_by(desc(Sections.id)).all()
    return render_template('respondent_report.html', 
        section_number=section_number,
        sections=sections,              
        dirUnit=dirUnit,
        dirProduct=dirProduct,
        current_user=current_user, 
        current_report=current_report,
        current_version=current_version
    )

def count_reports(year=None, quarter=None):
    filters = []
    if year:
        filters.append(Report.year == year)
    if quarter:
        filters.append(Report.quarter == quarter)

    statuses = [
        'Отправлен',
        'Есть замечания',
        'Одобрен',
        'Готов к удалению'
    ]
    
    counts = {status: Report.query.join(Version_report).filter(
        Version_report.status == status,
        *filters
    ).count() for status in statuses}

    all_count = Report.query.join(Version_report).filter(
        or_(*[Version_report.status == status for status in statuses]),
        *filters
    ).count()

    counts['all'] = all_count
    return counts



def get_reports_by_status(status, year=None, quarter=None):
    filters = []
    statuses = [
        'Отправлен',
        'Есть замечания',
        'Одобрен',
        'Готов к удалению'
    ]

    # Проверяем наличие организации и приводим okpo к строке
    if current_user.organization:
        user_organization_okpo = str(current_user.organization.okpo)[-4]  # Берем 4-й символ с конца
    else:
        user_organization_okpo = None

    user_type = current_user.type

    if year:
        filters.append(Report.year == year)
    if quarter:
        filters.append(Report.quarter == quarter)

    if user_type == "Администратор" or (current_user.organization and str(current_user.organization.okpo) == "8000"):
        if status == 'all_reports':
            return Report.query.join(Version_report).filter(
                or_(*[Version_report.status == s for s in statuses]),
                *filters
            ).order_by(Report.year.asc(), Report.quarter.asc()).all()
        else:
            trans_status = translate_status(status)
            if trans_status:
                return Report.query.join(Version_report).filter(
                    Version_report.status == trans_status,
                    *filters
                ).order_by(Report.year.asc(), Report.quarter.asc()).all()
            else:
                return []

    if user_organization_okpo is None:
        return []

    if status == 'all_reports':
        return Report.query.join(Version_report).filter(
            or_(*[Version_report.status == s for s in statuses]),
            *filters,
            func.substr(func.cast(Report.okpo, String), -4, 1) == user_organization_okpo
        ).order_by(Report.year.asc(), Report.quarter.asc()).all()
    else:
        trans_status = translate_status(status)
        if trans_status:
            return Report.query.join(Version_report).filter(
                Version_report.status == trans_status,
                *filters,
                func.substr(func.cast(Report.okpo, String), -4, 1) == user_organization_okpo
            ).order_by(Report.year.asc(), Report.quarter.asc()).all()
        else:
            return []

def translate_status(status):
    status_map = {
        'not_viewed': 'Отправлен',
        'remarks': 'Есть замечания',
        'to_download': 'Одобрен',
        'to_delete': 'Готов к удалению'
    }
    return status_map.get(status)

@views.route('/audit_area/<status>')
@login_required
@auditors_only
def audit_area(status):
    year_filter = request.args.get('year')
    quarter_filter = request.args.get('quarter')
    reports = get_reports_by_status(status, year_filter, quarter_filter)
    counts = count_reports(year_filter, quarter_filter)
    return render_template('audit_area.html',
                           current_user=current_user,
                           reports=reports,
                           not_viewedReports_count=counts['Отправлен'],
                           remarksReports_count=counts['Есть замечания'],
                           to_downloadReports_count=counts['Одобрен'],
                           to_deleteReports_count=counts['Готов к удалению'],
                           all_count = counts['Отправлен'] + counts['Есть замечания'] + counts['Одобрен'] + counts['Готов к удалению'],
                           year_filter=year_filter,
                           quarter_filter=quarter_filter,
                           year_today=year_today)

@views.route('/audit_area/report/<int:id>')
@login_required
@auditors_only
def audit_report(id):
    dirUnit = DirUnit.query.filter_by().all()
    dirProduct = DirProduct.query.filter_by().all()
    current_version = Version_report.query.filter_by(id=id).first()
    current_report = Report.query.filter_by(id=current_version.report_id).first()
    tickets = Ticket.query.filter_by(version_report_id = current_version.id).all()
    sections_fuel = Sections.query.filter_by(id_version=current_version.id, section_number=1).order_by(desc(Sections.id)).all()
    sections_heat = Sections.query.filter_by(id_version=current_version.id, section_number=2).order_by(desc(Sections.id)).all()
    sections_electro = Sections.query.filter_by(id_version=current_version.id, section_number=3).order_by(desc(Sections.id)).all()

    return render_template('audit_report.html', 
        sections_fuel=sections_fuel,   
        sections_heat=sections_heat,  
        sections_electro=sections_electro,      
        dirUnit=dirUnit,
        dirProduct=dirProduct,
        current_user=current_user, 
        current_report=current_report,
        current_version=current_version,
        tickets=tickets
    )




@views.route('/FAQ')
def FAQ():
    return render_template('FAQ.html', 
        current_user=current_user
    )

@views.route('/FAQ/<int:id>')
def FAQ_question(id):
    return render_template(f'Questions/{id}.html', 
        current_user=current_user
    )

@views.route('/news/<int:id>')
def news_post(id):
    post = News.query.filter_by(id = id).first()
    return render_template(f'Posts/1.html', 
        current_user=current_user,
        post=post
    )

@views.route('/news')
def news():
    all_news = News.query.filter_by().all()
    return render_template('news.html', 
        current_user=current_user,
        all_news=all_news
    )

@views.route('/help')
def help():
    return render_template('help.html', 
        current_user=current_user
    )

@views.route('/contacts')
def contacts():
    return render_template('contacts.html', 
        current_user=current_user
    )