from flask_admin.contrib.fileadmin import FileAdmin
import os
from urllib.parse import quote, unquote
from flask import redirect, url_for
from flask_login import current_user

class ImageView(FileAdmin):
    def __init__(self, *args, **kwargs):
        base_path = os.path.abspath(os.path.join(os.path.dirname(__name__), 'website', 'static', 'img'))
        image_folder = os.path.join(base_path, 'news')

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        
        super(ImageView, self).__init__(image_folder, '/static/img/news/', name='news_img')
    
    
    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == "Администратор"

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('views.login'))