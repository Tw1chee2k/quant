from flask_admin.contrib.sqla import ModelView


class TicketView(ModelView):
    column_display_pk = True
