from flask_admin.contrib.sqla import ModelView
from flask import redirect, url_for
from flask_login import current_user

class NewsView(ModelView):
    column_display_pk = True

    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == "Администратор"

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('views.login'))