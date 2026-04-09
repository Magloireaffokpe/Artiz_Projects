from django.urls import path
from .views import RegisterView, UserProfileView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", CustomTokenObtainPairView.as_view()),   # ← vue personnalisée
    path("me/", UserProfileView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]