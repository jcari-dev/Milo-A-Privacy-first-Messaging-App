from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.ExtendedUserRegistration.as_view()),
    path('validate-registration-form/', views.RegistrationValidation.as_view()),
    path('login/', views.LoginView.as_view(), name='login'),
]
