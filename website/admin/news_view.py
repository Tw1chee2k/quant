from flask_admin.contrib.sqla import ModelView


class NewsView(ModelView):
    column_display_pk = True

