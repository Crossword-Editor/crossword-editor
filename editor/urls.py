from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('', views.welcome, name="welcome"),
    path('', views.user_home, name="user_home"),
]
