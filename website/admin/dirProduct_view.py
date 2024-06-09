from flask_admin.contrib.sqla import ModelView


class DirProductView(ModelView):
    column_display_pk = True

