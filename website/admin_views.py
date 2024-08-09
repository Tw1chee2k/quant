import os
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_admin import Admin, AdminIndexView, expose
from flask_login import login_required, current_user
from functools import wraps
from .models import User, Organization, Report, Version_report, Ticket, DirUnit, DirProduct, Sections, OnlineUser
from datetime import datetime, timedelta

def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.type != 'Администратор':
            flash('Недостаточно прав для входа в админ-панель', 'error')
            return redirect(url_for('views.beginPage'))   
        return f(*args, **kwargs)
    return decorated_function

class MyMainView(AdminIndexView):
    @admin_only
    @expose('/stats')
    def admin_stats(self):
        user_data = User.query.count()
        dirUnit_data = DirUnit.query.count()
        organization_data = Organization.query.count()
        report_data = Report.query.count()
        version_report_data = Version_report.query.count()
        dirProduct_data = DirProduct.query.count()
        sections_data = Sections.query.count()
        ticket_data = Ticket.query.count()
        return self.render('admin/stats.html', 
                           user_data=user_data,
                           dirUnit_data=dirUnit_data,
                           organization_data=organization_data,
                           report_data=report_data,
                           version_report_data=version_report_data,
                           dirProduct_data=dirProduct_data,
                           sections_data=sections_data,
                           ticket_data=ticket_data)

class OnlineUserView(AdminIndexView):
    @admin_only
    @expose('/online_users')
    def OnlineUser_stats(self):
        now = datetime.utcnow()
        threshold = now - timedelta(minutes=5)
        online_users = OnlineUser.query.filter(OnlineUser.last_active > threshold).all()

        return self.render('admin/online_users.html', 
                            online_users=online_users)