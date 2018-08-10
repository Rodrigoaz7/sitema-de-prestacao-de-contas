from rest_framework import viewsets, generics,permissions
from .models import School
from rest_framework.authtoken.models import Token
from .serializers import *
from django.http import HttpResponse, JsonResponse
from rest_framework import permissions
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from django.core.mail import send_mail
from django.conf import settings
import django_filters
from rest_framework import filters
from accounts.models import *
from accounts.permissions import *


class SchoolFilter(generics.ListAPIView):

	serializer_class = SchoolDetailSerializer
	authentication_classes = (ExpiringTokenAuthentication,)
	filter_backends = (filters.DjangoFilterBackend,)
	
	def get_queryset(self):
		return School.objects.filter(director=self.request.user)
	
	filter_fields = ('name',)
	
class SchoolViewSet(viewsets.ModelViewSet):
	queryset = School.objects.all()
	serializer_class = SchoolSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

# Class with Mixin
class SchoolMixin(object):
	queryset = School.objects.all()
	serializer_class = SchoolSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

class SchoolList(SchoolMixin, generics.ListCreateAPIView):
	#queryset = School.objects.filter(director=request.user)
	serializer_class = SchoolDetailSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		school = Querysets_schools(Querysets_schools, request=request)
		serializer = SchoolDetailSerializer(school, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Requisição negada para esta url', status=status.HTTP_401_UNAUTHORIZED) 


class SchoolPost(SchoolMixin, generics.ListCreateAPIView):
	#queryset = School.objects.filter(director=request.user)
	serializer_class = SchoolSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if request.user.is_superuser:
			school = School.objects.all()
		else:
			school = School.objects.filter(director=request.user)
			
		serializer = SchoolSerializer(school, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = SchoolSerializer(data=request.data)
		if serializer.is_valid():
			serializer.create_normal(request.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAndSchoolRegister(SchoolMixin, generics.ListCreateAPIView):
	#queryset = School.objects.filter(director=request.user)
	serializer_class = RegisterSerializer
	permission_classes = (permissions.AllowAny,)

	def get(self, request, format=None):
		return Response(status=status.HTTP_200_OK)

	def post(self, request, format=None):
		serializer = RegisterSerializer(data=request.data)

		if serializer.is_valid():
			#ValidatorInit(request.data, serializer)
			#print(request.data['type_school'])
			user = serializer.create(request.data)
			#Envio de e-mail para o cliente
			msg = "Bem-vindo ao prestcon, você pode acessar sua conta a partir do link http://prestcondigital.com.br/gLogin.html"
			send_mail(
				'[Prestcon] Bem-vindo ao nosso sistema',
				msg,
				settings.DEFAULT_FROM_EMAIL,
				[user.email],
				fail_silently=False
			)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchoolUpdateView(SchoolMixin, generics.RetrieveUpdateAPIView):

	serializer_class = SchoolSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return School.objects.get(pk=pk)
		except School.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		school = self.get_object(pk)
		serializer = SchoolDetailSerializer(school)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		school = self.get_object(pk)
		serializer = SchoolSerializer(school, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		return Response('Requisição negada para esta url', status=status.HTTP_403_FORBIDDEN)


class SchoolDeleteView(SchoolMixin, generics.RetrieveUpdateAPIView):

	serializer_class = SchoolSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return School.objects.get(pk=pk)
		except School.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		school = self.get_object(pk)
		serializer = SchoolSerializer(school)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		return Response('Requisição negada para esta url', status=status.HTTP_403_FORBIDDEN)

	def delete(self, request, pk, format=None):
		school = self.get_object(pk)
		if(request.user.is_superuser):
			school.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		else:
			return Response('Você está tentando deletar uma escola sem permissão.', 
				status=status.HTTP_403_FORBIDDEN)