from django.urls import path
from .views import login_view, logout_view, register_view, dashboard_view, get_csrf_token, get_user_tickets, get_opened_tickets, get_in_progress_tickets, get_closed_tickets

urlpatterns = [
    path('api/csrf/', get_csrf_token, name='get_csrf_token'),
    path('api/register/', register_view, name='register'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/dashboard', dashboard_view, name="dashboard"),
    path('api/get_tickets/', get_user_tickets, name='get_user_tickets'),
    path('api/get_opened_tickets', get_opened_tickets, name="get_opened_tickets"),
    path('api/get_in_progress_tickets', get_in_progress_tickets, name="get_in_progress_tickets"),
    path('api/get_closed_tickets', get_closed_tickets, name="get_closed_tickets"),
]