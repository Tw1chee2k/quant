from flask_admin.contrib.fileadmin import FileAdmin
import os
from urllib.parse import quote, unquote
from flask import redirect, url_for
from flask_login import current_user

class DopView(FileAdmin):
    def __init__(self, *args, **kwargs):
        base_path = os.path.abspath(os.path.join(os.path.dirname(__name__), 'website'))
        dop_folder = os.path.join(base_path, 'dop_info')

        if not os.path.exists(dop_folder):
            os.makedirs(dop_folder)
        
        super(DopView, self).__init__(dop_folder, '/dop_info', name='dop_info')
    
    
    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == "Администратор"

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('views.login'))