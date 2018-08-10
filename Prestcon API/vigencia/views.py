from rest_framework import viewsets, generics
from .models import Vigencia
from .serializers import VigenciaSerializer
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
#from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication


class VigenciaViewSet(viewsets.ModelViewSet):
	queryset = Vigencia.objects.all()
	serializer_class = VigenciaSerializer

# Class with Mixin
class VigenciaMixin(object):
	queryset = Vigencia.objects.all()
	serializer_class = VigenciaSerializer

class VigenciaList(VigenciaMixin, generics.ListCreateAPIView):

	serializer_class = VigenciaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if not request.user.is_superuser:
			vigencia = Vigencia.objects.filter(director=request.user)
		else:
			vigencia = Vigencia.objects.all()

		serializer = VigenciaSerializer(vigencia, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)


class VigenciaPost(VigenciaMixin, generics.ListCreateAPIView):

	serializer_class = VigenciaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if not request.user.is_authenticated:
			return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
		if not request.user.is_superuser:
			vigencia = Vigencia.objects.filter(director=request.user)
		else:
			vigencia = Vigencia.objects.all()

		serializer = VigenciaSerializer(vigencia, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = VigenciaSerializer(data=request.data)
		if serializer.is_valid():
			serializer.create_normal(request.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VigenciaDeleteView(VigenciaMixin, generics.RetrieveUpdateAPIView):
	#queryset = Bank_account.objects.all()
	serializer_class = VigenciaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Bank_account.objects.get(pk=pk)
		except Bank_account.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, pk, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)

	def put(self, request, pk, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)

	def delete(self, request, pk, format=None):
		vigencia = self.get_object(pk)
		vigencia.delete()
		
		return Response(status=status.HTTP_204_NO_CONTENT)
		