from rest_framework import viewsets, generics
from .models import Bank_account
from .serializers import *
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from accounts.models import User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
import django_filters
from rest_framework import filters
from rest_framework_expiring_authtoken.models import Token


class BankFilter(generics.ListAPIView):

	queryset = Bank_account.objects.all()
	serializer_class = BankListSerializer
	authentication_classes = (ExpiringTokenAuthentication,)
	filter_backends = (filters.DjangoFilterBackend,)

	def get_queryset(self):
		return Bank_account.objects.filter(director=self.request.user)
	
	filter_fields = ('bank', 'bank_code')

class BankViewSet(viewsets.ModelViewSet):
	queryset = Bank_account.objects.all()
	serializer_class = BankSerializer

# Class with Mixin
class BankMixin(object):
	queryset = Bank_account.objects.all()
	serializer_class = BankSerializer

class BankList(BankMixin, generics.ListCreateAPIView):

	serializer_class = BankListSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if not request.user.is_superuser:
			bank = Bank_account.objects.filter(director=request.user)
		else:
			bank = Bank_account.objects.all()

		serializer = BankListSerializer(bank, many=True)
		return Response(serializer.data)

class BankPost(BankMixin, generics.ListCreateAPIView):

	serializer_class = BankSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if not request.user.is_superuser:
			bank = Bank_account.objects.filter(director=request.user)
		else:
			bank = Bank_account.objects.all()

		serializer = BankSerializer(bank, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = BankSerializer(data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BankUpdateView(BankMixin, generics.RetrieveUpdateAPIView):
	#queryset = Bank_account.objects.all()
	serializer_class = BankSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Bank_account.objects.get(pk=pk)
		except Bank_account.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		bank = self.get_object(pk)
		serializer = BankListSerializer(bank)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		bank = self.get_object(pk)
		serializer = BankSerializer(bank, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankDeleteView(BankMixin, generics.RetrieveUpdateAPIView):
	#queryset = Bank_account.objects.all()
	serializer_class = BankSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Bank_account.objects.get(pk=pk)
		except Bank_account.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Você não tem permissão para realizar este comando aqui.',status=status.HTTP_403_FORBIDDEN)

	def put(self, request, pk, format=None):
		return Response('Você não tem permissão para realizar este comando aqui.',status=status.HTTP_403_FORBIDDEN)


	def delete(self, request, pk, format=None):
		bank = self.get_object(pk)
		bank.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
