import os
from flask_admin import expose, AdminIndexView
from .models import User, Organization, Report, Version_report, Ticket, DirUnit, DirProduct, Sections
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify

class MyMainView(AdminIndexView):
    @expose('/')
    def admin_stats(self):
        base_path = os.path.abspath(os.path.join(os.path.dirname(__name__), 'website'))
        image_folder = os.path.join(base_path, 'static', 'img')
        images = [url_for('static', filename=f'img/{image}') for image in os.listdir(image_folder)]
        num_images = len(images)
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
                           ticket_data=ticket_data,
                           images=images, 
                           num_images=num_images
                           )