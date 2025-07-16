from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf.urls.static import static
from django.conf import settings  # ✅ ISSO AQUI

def home_view(request):
    return JsonResponse({"mensagem": "Backend funcionando 🚀"})

urlpatterns = [
    path('', home_view),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
