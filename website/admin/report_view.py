from flask_admin.contrib.sqla import ModelView


class ReportView(ModelView):
    column_display_pk = True

