# userauths/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from userauths.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

# Registro base (usado por estudante e empresa)
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        username = data.get("username")
        full_name = data.get("nome")
        phone = data.get("telefone")
        password = data.get("password")

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=full_name,
            phone=phone,
            password=password
        )

        return Response({"message": "Usuário registrado com sucesso"}, status=status.HTTP_201_CREATED)


# View para login
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            })
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

def home_view(request):
    return JsonResponse({"mensagem": "Backend funcionando 🚀"})