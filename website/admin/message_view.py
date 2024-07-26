from flask_admin.contrib.sqla import ModelView


class MessageView(ModelView):
    column_display_pk = True
