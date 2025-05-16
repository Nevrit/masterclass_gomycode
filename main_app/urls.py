from django.urls import path
from main_app import views

urlpatterns = [
    path('', views.perform_login, name="perform_login"),
    path('inscription', views.perfom_inscription, name="perfom_inscription"),
    path('accueil', views.index, name="index-page")
    # path('perform_login', views.perform_login, name="perform_login"),
    # path('perform_logout', views.perform_logout, name="perform_logout"),
]