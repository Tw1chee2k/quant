from flask_admin.contrib.sqla import ModelView


class Version_reportView(ModelView):
    column_display_pk = True
    column_list = ['id', 'begin_time', 'change_time', 'control', 'agreed', 'sent', 'agreed_time', 'fio', 'telephone', 'email', 'report_id']
    column_default_sort = ('fio', True)
    column_sortable_list = ('id', 'begin_time', 'change_time', 'control', 'agreed', 'sent', 'agreed_time', 'fio', 'telephone', 'email', 'report_id')
    
