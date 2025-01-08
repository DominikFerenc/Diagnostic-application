from django.urls import path

from .views import AddDevice, login_user, register_user

urlpatterns = [
    path("register/", register_user, name="register"),
    path("login/", login_user, name="login"),
    path('devices/add/', AddDevice.as_view(), name='add_device'),
]
