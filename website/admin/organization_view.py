from flask_admin.contrib.sqla import ModelView


class OrganizationView(ModelView):
    column_display_pk = True

    