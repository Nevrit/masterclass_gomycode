from django.urls import path
from .views import login_view, logout_view, register_view, dashboard_view, get_csrf_token

urlpatterns = [
    path('api/csrf/', get_csrf_token, name='get_csrf_token'),
    path('api/register/', register_view, name='register'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/dashboard', dashboard_view, name="dashboard")
]