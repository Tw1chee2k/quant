from flask_admin.contrib.sqla import ModelView


class Version_reportView(ModelView):
    column_display_pk = True
    column_list = ['id', 'begin_time', 'change_time', 'status', 'sent_time', 'fio', 'telephone', 'email', 'report_id']
    column_default_sort = ('fio', True)
    column_sortable_list = ('id', 'begin_time', 'change_time', 'status', 'sent_time', 'fio', 'telephone', 'email', 'report_id')
    
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