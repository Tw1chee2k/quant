from flask_admin.contrib.sqla import ModelView
from flask import redirect, url_for
from flask_login import current_user

class SectionsView(ModelView):
    column_display_pk = True
    column_list = ['id', 'id_version', 'id_product', 'code_product', 'section_number', 'Oked', 'produced', 'Consumed_Quota', 'Consumed_Fact', 'Consumed_Total_Quota', 'Consumed_Total_Fact', 'note']
    column_default_sort = ('id', True)
    column_sortable_list = ('id', 'id_version', 'id_product', 'code_product', 'section_number', 'Oked', 'produced', 'Consumed_Quota', 'Consumed_Fact', 'Consumed_Total_Quota', 'Consumed_Total_Fact', 'note')
    
    
    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == "Администратор"

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('views.login'))