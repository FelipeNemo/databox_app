from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import RegisterView, LoginView, create_special_user

def home_view(request):
    return JsonResponse({"mensagem": "Backend funcionando 🚀"})


urlpatterns = [
    path("estudante/register/", RegisterView.as_view(), name="register_estudante"),
    path("empresa/register/", RegisterView.as_view(), name="register_empresa"),
    path("login/", LoginView.as_view(), name="login"),
    path('create-special-user/', create_special_user),  # <== Novo endpoint secreto
]

# ✅ Essas linhas servem para exibir imagens, CSS etc durante o desenvolvimento
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
