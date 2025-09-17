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
from notifications.utils import criar_notificacoes_s, criar_notificacao_random


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


# Login com criação de notificações diárias + random
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        # JWT
        refresh = RefreshToken.for_user(user)
        
        # 🔹 Cria notificações diárias
        diarias = criar_notificacoes_s(user)  # retorna lista de notificações criadas

        # 🔹 Cria notificação random (apenas 1)
        random_notif = criar_notificacao_random(user)

        # 🔹 Juntar todas para enviar de volta no login
        todas_notifs = diarias
        if random_notif:
            todas_notifs.append(random_notif)

        serializer = NotificationSerializer(todas_notifs, many=True)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "tipo_conta": user.tipo_conta,
            "notifications": serializer.data  # 🔹 notificações do dia
        })


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
