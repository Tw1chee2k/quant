from flask_admin.contrib.sqla import ModelView


class SectionsView(ModelView):
    column_display_pk = True
