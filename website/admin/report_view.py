from flask_admin.contrib.sqla import ModelView


class ReportView(ModelView):
    column_display_pk = True
    can_delete = True
    can_create = True
    can_edit = True
    can_export = True
    column_list = ['id', 'okpo', 'organization_name', 'year', 'quarter', 'user_id', 'time_of_receipt', 'category', 'versions']

    AVAILABLE_Report_TYPES = [
        (u'Не просмотренные', u'Не просмотренные'),
        (u'Есть замечания', u'Есть замечания'),
        (u'Готов к загрузке', u'Готов к загрузке'),
        (u'Готов к удалению', u'Готов к удалению'),
    ]
    
    form_choices = {
        'category': AVAILABLE_Report_TYPES,
    }

    column_editable_list = ['category']