from flask_admin.contrib.sqla import ModelView


class DirUnitView(ModelView):
    column_display_pk = True

