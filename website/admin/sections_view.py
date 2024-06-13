from flask_admin.contrib.sqla import ModelView


class SectionsView(ModelView):
    column_display_pk = True
    column_list = ['id', 'id_version', 'id_product', 'code_product', 'section_number', 'Oked', 'produced', 'Consumed_Quota', 'Consumed_Fact', 'Consumed_Total_Quota', 'Consumed_Total_Fact', 'note']
    column_default_sort = ('id', True)
    column_sortable_list = ('id', 'id_version', 'id_product', 'code_product', 'section_number', 'Oked', 'produced', 'Consumed_Quota', 'Consumed_Fact', 'Consumed_Total_Quota', 'Consumed_Total_Fact', 'note')
    