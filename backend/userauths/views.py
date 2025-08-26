#useraauths/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.utils.timezone import now

from userauths.models import User
from notifications.utils import enviar_notificacao
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from django.http import JsonResponse

from userauths.models import User
from notifications.utils import criar_notificacoes_diarias


# Registro base (usado por estudante e empresa)
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        username = data.get("username")
        full_name = data.get("nome")
        phone = data.get("telefone")
        password = data.get("password")
        tipo_conta = data.get("tipo_conta")

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=full_name,
            phone=phone,
            password=password,
            tipo_conta=tipo_conta
        )
        return Response({"message": "Usuário registrado com sucesso"}, status=status.HTTP_201_CREATED)


# Login com criação de notificações diárias
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        # JWT
        refresh = RefreshToken.for_user(user)
        
        # 🔹 Cria notificações diárias no login
        criar_notificacoes_diarias(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "tipo_conta": user.tipo_conta
        })

# Notificações do usuário (somente as não lidas do dia atual)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_notifications(request):
    user = request.user
    hoje = now().date()

    notifications = Notification.objects.filter(
        user=user,
        is_read=False,
        created_at__date=hoje
    ).order_by('-created_at')

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


# Criar usuário especial (admin/helpers)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAdminUser])
def create_special_user(request):
    data = request.data
    email = data.get("email")
    username = data.get("username")
    full_name = data.get("nome")
    phone = data.get("telefone")
    password = data.get("password")
    tipo_conta = data.get("tipo_conta")

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        email=email,
        username=username,
        full_name=full_name,
        phone=phone,
        password=password,
        tipo_conta=tipo_conta
    )

    return Response({"message": f"Usuário especial '{tipo_conta}' registrado com sucesso."}, status=status.HTTP_201_CREATED)


def home_view(request):
    return JsonResponse({"mensagem": "Backend funcionando 🚀"})
