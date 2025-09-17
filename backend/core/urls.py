from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"mensagem": "Backend funcionando 🚀"})

urlpatterns = [
    path('', home_view, name='home'),
    path("admin/", admin.site.urls),
    path("auth/", include("userauths.urls")),  # autenticação
    path("notifications/", include('notifications.urls')),  # notificações
    path("rewards/", include("rewards.urls")),  # recompensas
    

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
