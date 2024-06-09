from . import db
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Numeric

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(13), default='Респондент')
    email = db.Column(db.String(50), unique=True)
    fio = db.Column(db.String(30))
    telephone = db.Column(db.String(20))
    password = db.Column(db.String(50))
    reports = relationship('Report', backref='user')

class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(50))
    short_name = db.Column(db.String(20))
    okpo = db.Column(db.Integer)
    ynp = db.Column(db.Integer)
    reports = relationship('Report', backref='organization')
    
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    okpo = db.Column(db.Integer)
    organization_name = db.Column(db.String(50))
    year = db.Column(db.Integer)
    quarter = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))  
    versions = relationship('Version_report', backref='report')

class Version_report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    begin_time = db.Column(db.Date, default=datetime.now())
    change_time = db.Column(db.Date)
    control = db.Column(db.Boolean, default=False)
    agreed = db.Column(db.Boolean, default=False)
    agreed_time = db.Column(db.Date)
    fio = db.Column(db.String(30))
    telephone = db.Column(db.String(20))    
    email = db.Column(db.String(50))
    report_id = db.Column(db.Integer, db.ForeignKey('report.id'))

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    begin_time = db.Column(db.Date, default=datetime.now())
    luck = db.Column(db.Boolean, default=False)
    note = db.Column(db.String(200))
    version_report_id = db.Column(db.Integer, db.ForeignKey('version_report.id'))
    version_report = relationship("Version_report", backref="ticket")

class DirUnit(db.Model):
    __tablename__ = 'DirUnit'
    IdUnit = db.Column(db.Integer, primary_key = True)
    CodeUnit = db.Column(db.String(4000))
    NameUnit = db.Column(db.String(4000))
    
class DirProduct(db.Model):
    __tablename__ = 'DirProduct'
    IdProduct = db.Column(db.Integer, primary_key = True)
    CodeProduct = db.Column(db.String(4000))
    NameProduct = db.Column(db.String(4000))
    IsFuel = db.Column(db.Boolean)
    IsHeat = db.Column(db.Boolean) 
    IsElectro = db.Column(db.Boolean)
    IdUnit = db.Column(db.Integer, db.ForeignKey('DirUnit.IdUnit'))
    DateStart = db.Column(db.Date)
    DateEnd = db.Column(db.Date)
    unit = relationship("DirUnit", foreign_keys=[IdUnit], backref="products")
    
class Sections(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    id_version = db.Column(db.Integer, db.ForeignKey('version_report.id'))
    id_product = db.Column(db.Integer, db.ForeignKey('DirProduct.IdProduct'))
    code_product = db.Column(db.Integer, db.ForeignKey('DirProduct.CodeProduct'))
    
    section_number = db.Column(db.Integer)
    Oked = db.Column(db.Integer)
    produced = db.Column(Numeric(precision=10, scale=2))
    Consumed_Quota = db.Column(Numeric(precision=10, scale=2))
    Consumed_Fact = db.Column(Numeric(precision=10, scale=2))
    Consumed_Total_Quota = db.Column(Numeric(precision=10, scale=2))
    Consumed_Total_Fact = db.Column(Numeric(precision=10, scale=2))
    note = db.Column(db.String(200))
    product = relationship("DirProduct", foreign_keys=[id_product], backref="section")
    

    
