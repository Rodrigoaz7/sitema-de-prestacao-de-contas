from rest_framework import viewsets, generics, permissions
from .models import *
from rest_framework.response import Response
from .serializers import *
from django.http import Http404
from rest_framework import status
from school.views import SchoolMixin
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from rest_framework_expiring_authtoken.models import Token
from django.contrib.auth.base_user import BaseUserManager
from django.core.mail import send_mail
from django.conf import settings
from .permissions import *


class TestTokenView(generics.ListCreateAPIView):

	permission_classes = (AllowAny,)
	
	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		if Token.objects.filter(key=request.data).exists():
			return Response("Token válido", status=status.HTTP_200_OK)
		else:
			return Response('Token inválido ou expirado', status=status.HTTP_401_UNAUTHORIZED)


class RecoveryPasswordView(generics.ListCreateAPIView):

	permission_classes = (AllowAny,)
	
	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		if User.objects.filter(email=request.data).exists():
			diretor = User.objects.get(email=request.data)
			random_password = BaseUserManager().make_random_password()
			diretor.set_password(random_password)
			diretor.save()
			#Envio de e-mail para o cliente
			msg = "Olá, uma nova senha foi criada para o diretor cadastrado com este e-mail: " +  random_password
			send_mail(
				'[Prestcon] Recuperação de senha',
				msg,
				settings.DEFAULT_FROM_EMAIL,
				[request.data],
				fail_silently=False
			)

			return Response("Senha gerada e enviada para o e-mail", status=status.HTTP_200_OK)
		else:
			return Response('E-mail não existe', status=status.HTTP_401_UNAUTHORIZED)


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer

# Class with Mixin
class UserMixin(object):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class UserList(UserMixin, generics.ListCreateAPIView):
	
	serializer_class = UserSerializer
	authentication_classes = (ExpiringTokenAuthentication,)
	#Pego o token
	#print(request.auth)
	#Função de leitura
	def get(self, request, format=None):
		
		if request.user.is_superuser:
			user = UserMaster.objects.get(user=request.user)
			serializer = UserMasterSerializer(user, many=False)
		elif request.user.is_staff:
			user = UserDesenvolvedor.objects.get(user=request.user)
			serializer = UserDesenvolvedorSerializer(user, many=False)
		elif request.user.is_diretor:
			user = UserDiretor.objects.get(user=request.user)
			serializer = UserDiretorSerializer(user,many=False)
		elif request.user.is_secretario:
			user = UserSecretaria.objects.get(user=request.user)
			serializer = UserSecretariaSerializer(user, many=False)
		elif request.user.is_auditor:
			user = UserAuditor.objects.get(user=request.user)
			serializer = UserAuditorSerializer(user, many=False)

		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)


class UserUpdateView(UserMixin, generics.RetrieveUpdateAPIView):
	#queryset = User.objects.all()
	serializer_class = UserSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return User.objects.get(pk=pk)
		except User.DoesNotExist:
			raise Http404

	#Função de leitura de um único objeto acessado pelo id
	def get(self, request, pk, format=None):
		director = self.get_object(pk)
		if(director == request.user or request.user.is_superuser):
			serializer = UserSerializer(director)
			return Response(serializer.data)
		else:
			return Response('Você está tentando acessar um usuário sem permissão.', 
				status=status.HTTP_403_FORBIDDEN)

	#Função de update
	def put(self, request, pk, format=None):
		director = self.get_object(pk)
		if(director == request.user or request.user.is_superuser):
			serializer = UserSerializer(director, data=request.data)
			if serializer.is_valid():
				serializer.update(request.data)
				return Response(serializer.data)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response('Você está tentando acessar um usuário sem permissão.', 
				status=status.HTTP_403_FORBIDDEN)

	def delete(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)


class UserDeleteView(UserMixin, generics.RetrieveUpdateAPIView):
	#queryset = User.objects.all()
	serializer_class = UserSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return User.objects.get(pk=pk)
		except User.DoesNotExist:
			raise Http404

	#Função de leitura de um único objeto acessado pelo id
	def get(self, request, pk, format=None):
		director = self.get_object(pk)
		if(director == request.user or request.user.is_superuser):
			serializer = UserSerializer(director)
			return Response(serializer.data)
		else:
			return Response('Você está tentando acessar um usuário sem permissão.', 
				status=status.HTTP_403_FORBIDDEN)

	#Função de deletar
	def delete(self, request, pk, format=None):
		director = self.get_object(pk)
		if(request.user.is_superuser):
			director.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		else:
			return Response('Você está tentando acessar um usuário sem permissão.', 
				status=status.HTTP_403_FORBIDDEN)

	def put(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)


class UserSecretariaView(UserMixin, generics.ListCreateAPIView):
	
	serializer_class = UserSecretariaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return UserSecretaria.objects.get(pk=pk)
		except UserSecretaria.DoesNotExist:
			raise Http404

	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		if not request.user.is_superuser:
			return Response('Apenas o user Master pode criar contas para secretarias', status=status.HTTP_403_FORBIDDEN)
		else:	
			serializer = UserSecretariaSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response("Criado com sucesso", status=status.HTTP_200_CREATED)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk, format=None):
		usuario = self.get_object(pk)
		if request.user.is_superuser or request.user.is_secretario:
			if usuario.user == request.user or request.user.is_superuser:
				serializer = UserSecretariaSerializer(data=request.data)
				if serializer.is_valid():
					serializer.update(request.data, usuario)
					return Response("Atualizado com sucesso", status=status.HTTP_200_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserAuditorView(UserMixin, generics.ListCreateAPIView):
	
	serializer_class = UserAuditorSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return UserAuditor.objects.get(pk=pk)
		except UserAuditor.DoesNotExist:
			raise Http404

	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		if not request.user.is_secretario:
			return Response('Apenas secretarias podem criar contas para auditores', status=status.HTTP_403_FORBIDDEN)
		else:
			serializer = UserAuditorSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response("Criado com sucesso", status=status.HTTP_200_CREATED)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk, format=None):
		usuario = self.get_object(pk)
		if request.user.is_superuser or request.user.is_staff or usuario.user == request.user:
			serializer = UserAuditorSerializer(data=request.data)
			if serializer.is_valid():
				serializer.update(request.data, usuario.secretaria, usuario)
				return Response("Atualizado com sucesso", status=status.HTTP_200_CREATED)
		elif request.user.is_secretario and request.user == usuario.secretaria:
			serializer = UserAuditorSerializer(data=request.data)
			if serializer.is_valid():
				serializer.update(request.data, usuario.secretaria, usuario)
				return Response("Atualizado com sucesso", status=status.HTTP_200_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


