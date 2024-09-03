from flask_admin.contrib.fileadmin import FileAdmin
import os
from urllib.parse import quote, unquote

class DopView(FileAdmin):
    def __init__(self, *args, **kwargs):
        base_path = os.path.abspath(os.path.join(os.path.dirname(__name__), 'website'))
        dop_folder = os.path.join(base_path, 'dop_info')

        if not os.path.exists(dop_folder):
            os.makedirs(dop_folder)
        
        super(DopView, self).__init__(dop_folder, '/dop_info', name='dop_info')
