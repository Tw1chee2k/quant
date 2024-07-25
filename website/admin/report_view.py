from flask_admin.contrib.sqla import ModelView


class ReportView(ModelView):
    column_display_pk = True
    can_delete = True
    can_create = True
    can_edit = True
    can_export = True
    column_list = ['id', 'okpo', 'organization_name', 'year', 'quarter', 'user_id', 'time_of_receipt', 'versions']



   