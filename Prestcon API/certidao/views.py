from rest_framework import viewsets, generics
from .models import Certidao
from .serializers import CertidaoSerializer
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from fornecedor.models import Fornecedor
from accounts.permissions import *
from accounts.auditorias import *
from datetime import datetime


class CertidaoViewSet(viewsets.ModelViewSet):
	queryset = Certidao.objects.all()
	serializer_class = CertidaoSerializer

# Class with Mixin
class CertidaoMixin(object):
	queryset = Certidao.objects.all()
	serializer_class = CertidaoSerializer

class CertidaoList(CertidaoMixin, generics.ListCreateAPIView):

	serializer_class = CertidaoSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):

		certidao = Querysets_certidoes(Querysets_certidoes, request)
		if not request.GET:
			serializer = CertidaoSerializer(certidao, many=True)
			return Response(serializer.data)
		else:
			certidoes_filtradas = []
			if request.GET['validade'] == "vencidas":
				for validade in certidao:
					if validade.final_validade:
						if datetime.strptime(validade.final_validade, '%d/%m/%Y') <= datetime.now():
							certidoes_filtradas.append(validade)
				serializer = CertidaoSerializer(certidoes_filtradas, many=True)
				return Response(serializer.data)

			elif request.GET['validade'] == "ativas":
				for validade in certidao:
					if validade.final_validade:
						if datetime.strptime(validade.final_validade, '%d/%m/%Y') > datetime.now():
							certidoes_filtradas.append(validade)
				serializer = CertidaoSerializer(certidoes_filtradas, many=True)
				return Response(serializer.data)

			else:
				serializer = CertidaoSerializer(certidao, many=True)
				return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)


#Classe a ser usada para compartilhamento de certidoes
class CertidoesAuditadasList(CertidaoMixin, generics.ListCreateAPIView):

	serializer_class = CertidaoSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		certidao = Querysets_certidoes(Querysets_certidoes, request)
		certidao = certidao.filter(is_auditada=True)
		serializer = CertidaoSerializer(certidao, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)


class CertidaoView(CertidaoMixin, generics.RetrieveUpdateAPIView):
	#queryset = Bank_account.objects.all()
	serializer_class = CertidaoSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Certidao.objects.get(pk=pk)
		except Certidao.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		certidao = self.get_object(pk)
		serializer = CertidaoSerializer(certidao, many=False)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		certidao = self.get_object(pk)
		if not certidao.is_auditada:
			serializer = CertidaoSerializer(certidao, data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return Response("Certidão já auditada", status=status.HTTP_403_FORBIDDEN)


class ValidarCertidao(CertidaoMixin, generics.RetrieveUpdateAPIView):

    serializer_class = CertidaoSerializer
    authentication_classes = (ExpiringTokenAuthentication,)

    def get_object(self, pk):
        try:
            return Certidao.objects.get(pk=pk)
        except Certidao.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk, format=None):
    	certidao = self.get_object(pk)
    	resposta = Auditoria_certidoes(Auditoria_certidoes, request, certidao)
    	return resposta

    def post(self, request, format=None):
        return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, format=None):
        return Response('Operação irregular', status=status.HTTP_403_FORBIDDEN)