from flask_admin.contrib.sqla import ModelView
from flask import redirect, url_for
from flask_login import current_user

class Version_reportView(ModelView):
    column_display_pk = True
    column_list = ['id', 'begin_time', 'change_time', 'status', 'sent_time', 'fio', 'telephone', 'email', 'hasNot','report_id']
    column_default_sort = ('fio', True)
    column_sortable_list = ('id', 'begin_time', 'change_time', 'status', 'sent_time', 'fio', 'telephone', 'email', 'hasNot', 'report_id')
    
    AVAILABLE_versions_TYPES = [
        (u'Заполнение', u'Заполнение'),
        (u'Контроль пройден', u'Контроль пройден'),
        (u'Согласовано', u'Согласовано'),
        (u'Отправлен', u'Отправлен'),  

        (u'Не просмотрено', u'Не просмотрено'),

        (u'Есть замечания', u'Есть замечания'),
        (u'Одобрен', u'Одобрен'),
        (u'Готов к удалению', u'Готов к удалению'),
    ]
    
    form_choices = {
        'status': AVAILABLE_versions_TYPES,
    }


    column_editable_list = ['status']


    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == "Администратор"

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('views.login'))