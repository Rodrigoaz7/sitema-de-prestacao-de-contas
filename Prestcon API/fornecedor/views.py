from rest_framework import viewsets, generics
from .models import Fornecedor
from .serializers import FornecedorSerializer
from certidao.serializers import CertidaoSerializer
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
#from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from accounts.permissions import *

class FornecedorViewSet(viewsets.ModelViewSet):
	queryset = Fornecedor.objects.all()
	serializer_class = FornecedorSerializer

# Class with Mixin
class FornecedorMixin(object):
	queryset = Fornecedor.objects.all()
	serializer_class = FornecedorSerializer

class FornecedorList(FornecedorMixin, generics.ListCreateAPIView):

	serializer_class = FornecedorSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		fornecedor = Querysets_fornecedores(Querysets_fornecedores, request)	
		print(fornecedor)					
		serializer = FornecedorSerializer(fornecedor, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)


class FornecedorPost(FornecedorMixin, generics.ListCreateAPIView):

	serializer_class = FornecedorSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if not request.user.is_superuser:
			fornecedor = Fornecedor.objects.filter(vigencia__director=request.user)
		else:
			fornecedor = Fornecedor.objects.all()

		serializer = FornecedorSerializer(fornecedor, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = FornecedorSerializer(data=request.data)
		serializer2 = CertidaoSerializer(data=request.data)

		if serializer.is_valid():
			fornecedor = serializer.create(request.data)
			serializer2.create(fornecedor)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FornecedorSingle(FornecedorMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = FornecedorSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Fornecedor.objects.get(pk=pk)
		except Fornecedor.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		fornecedor = self.get_object(pk)
		serializer = FornecedorSerializer(fornecedor, many=False)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		fornecedor = self.get_object(pk)
		fornecedor.delete()
		return Response("Deletado", status=status.HTTP_204_NO_CONTENT)