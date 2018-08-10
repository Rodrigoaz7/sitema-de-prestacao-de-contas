from rest_framework import viewsets, generics
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import Http404
from django.conf import settings
import django_filters
from rest_framework import filters
import json, requests, urllib
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from .models import *
from .serializers import *
from accounts.permissions import *
from accounts.auditorias import Auditoria_despesas

class DespesaFilter(generics.ListAPIView):

	authentication_classes = (ExpiringTokenAuthentication,)
	serializer_class = DespesaListSerializer
	filter_backends = (filters.DjangoFilterBackend,)

	def get_queryset(self):
		return Despesa.objects.filter(vigencia__director=self.request.user)

	filter_fields = ('tipo_despesa', 'tipo_documento', 'fornecedor__name', 'bank__name')


class DespesaViewSet(viewsets.ModelViewSet):
	queryset = Despesa.objects.all()
	serializer_class = DespesaSerializer

# Class with Mixin
class DespesaMixin(object):
	queryset = Despesa.objects.all()
	serializer_class = DespesaSerializer


class DespesaList(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaListSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		despesa = Querysets_despesas(Querysets_despesas, request)
		serializer = DespesaListSerializer(despesa, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Operação inválida para esta URL', status=status.HTTP_401_UNAUTHORIZED)


class DespesaPost(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		return Response("ERRO", status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):   
		serializer = DespesaSerializer(data=request.data)
		if serializer.is_valid():			
			serializer.create(request.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DespesaUpdateView(DespesaMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.all()
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		despesa = self.get_object(pk)
		serializer = DespesaSerializer(despesa)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		despesa = self.get_object(pk)
		if not despesa.is_auditada:
			serializer = DespesaSerializer(despesa, data=request.data)
			if despesa.tipo_documento == "Fatura":
				serializer2 = ProdutoFatSerializer(data=request.data)
			elif despesa.tipo_documento == "Recibo":
				serializer2 = ProdutoRecSerializer(data=request.data)
				print(request.data)
			else:
				if despesa.tipo_nota_fiscal == "Manual":
					serializer2 = ProdutoNfSerializer(data=request.data)
				else:
					serializer2 = NotaEletronicaSerializer(data=request.data)

			if serializer.is_valid():
				serializer2.update(request.data)
				serializer.save()
				return Response(serializer.data)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		return Response("Despesa já auditada", status=status.HTTP_403_FORBIDDEN)

	def delete(self, request, pk, format=None):
		despesa = self.get_object(pk)
		if not despesa.is_auditada:
			despesa.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		return Response("Despesa já auditada", status=status.HTTP_403_FORBIDDEN)


class DespesaDeleteView(DespesaMixin, generics.RetrieveUpdateAPIView):

	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Requisição negada para esta url', status=status.HTTP_403_FORBIDDEN)

	def put(self, request, pk, format=None):
		return Response('Requisição negada para esta url', status=status.HTTP_403_FORBIDDEN)

	def delete(self, request, pk, format=None):
		despesa = self.get_object(pk)
		if not despesa.is_auditada:
			despesa.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		return Response("Despesa já auditada", status=status.HTTP_403_FORBIDDEN)


class NFeList(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if request.user.is_superuser:
			nfe = nfe.filter(tipo_documento="Nota Fiscal").filter(tipo_nota_fiscal="Eletrônica")
		elif request.user.is_diretor:
			nfe = Despesa.objects.filter(vigencia__director=request.user)
			nfe = nfe.filter(tipo_documento="Nota Fiscal").filter(tipo_nota_fiscal="Eletrônica")
		else:
			return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

		serializer = DespesaSerializer(nfe, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


class NFManualList(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if request.user.is_superuser:
			nf = Despesa.objects.filter(tipo_documento="Nota Fiscal").filter(tipo_nota_fiscal="Manual")
		elif request.user.is_diretor:
			nf = Despesa.objects.filter(vigencia__director=request.user)
			nf = nf.filter(tipo_documento="Nota Fiscal").filter(tipo_nota_fiscal="Manual")
		else:
			return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

		serializer = DespesaSerializer(nf, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


class ReciboList(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):

		if request.user.is_superuser:
			rec = Despesa.objects.filter(tipo_documento="Recibo")
		elif request.user.is_diretor:
			rec = Despesa.objects.filter(vigencia__director=request.user)
			rec = rec.filter(tipo_documento="Recibo")
		else:
			return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

		serializer = DespesaSerializer(rec, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)



class FaturaList(DespesaMixin, generics.ListCreateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		if request.user.is_superuser:
			fat = Despesa.objects.filter(tipo_documento="Fatura")
		elif request.user.is_diretor:
			fat = Despesa.objects.filter(vigencia__director=request.user)
			fat = fat.filter(tipo_documento="Fatura")
		else:
			return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


		serializer = DespesaSerializer(fat, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


# Class with Mixin
class ProdutoFaturaViewSet(viewsets.ModelViewSet):
	queryset = ProdutoFat.objects.all()
	serializer_class = ProdutoFatSerializer


class ProdutoFaturaMixin(object):
	queryset = ProdutoFat.objects.all()
	serializer_class = ProdutoFatSerializer


class ProdutoFaturaList(ProdutoFaturaMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoFatSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		fatura = ProdutoFat.objects.filter(despesa=self.get_object(pk))
		serializer_context = {
			'request': request,
		}
		serializer = ProdutoFatSerializer(fatura, context=serializer_context, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


class ProdutoFaturaDelete(ProdutoFaturaMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoFatSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return ProdutoFat.objects.get(pk=pk)
		except ProdutoFat.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		produto = self.get_object(pk)
		produto.delete()
		return Response("Deletado", status=status.HTTP_204_NO_CONTENT)


# Class with Mixin
class ProdutoReciboViewSet(viewsets.ModelViewSet):
	queryset = ProdutoRec.objects.all()
	serializer_class = ProdutoRecSerializer


class ProdutoReciboMixin(object):
	queryset = ProdutoRec.objects.all()
	serializer_class = ProdutoRecSerializer


class ProdutoReciboList(ProdutoReciboMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoRecSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		recibo = ProdutoRec.objects.filter(despesa=self.get_object(pk))
		serializer_context = {
			'request': request,
		}
		serializer = ProdutoRecSerializer(recibo, context=serializer_context, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


class ProdutoReciboDelete(ProdutoReciboMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoRecSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return ProdutoRec.objects.get(pk=pk)
		except ProdutoRec.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		produto = self.get_object(pk)
		produto.delete()
		return Response("Deletado", status=status.HTTP_204_NO_CONTENT)

# Class with Mixin
class ProdutoNfViewSet(viewsets.ModelViewSet):
	queryset = ProdutoNf.objects.all()
	serializer_class = ProdutoNfSerializer


class ProdutoNfMixin(object):
	queryset = ProdutoNf.objects.all()
	serializer_class = ProdutoNfSerializer


class ProdutoNotaFiscalList(ProdutoNfMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoNfSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		nf = ProdutoNf.objects.filter(despesa=self.get_object(pk))
		serializer_context = {
			'request': request,
		}
		serializer = ProdutoNfSerializer(nf, context=serializer_context, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)


class ProdutoNotaFiscalDelete(ProdutoNfMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoNfSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return ProdutoNf.objects.get(pk=pk)
		except ProdutoNf.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		produto = self.get_object(pk)
		produto.delete()
		return Response("Deletado", status=status.HTTP_204_NO_CONTENT)


# Class with Mixin
class ProdutoNfEletViewSet(viewsets.ModelViewSet):
	queryset = ProdutoNfelet.objects.all()
	serializer_class = ProdutoNfeletSerializer

class ProdutoNfEletMixin(object):
	queryset = ProdutoNfelet.objects.all()
	serializer_class = ProdutoNfeletSerializer

class ProdutoNotaFiscalEletList(ProdutoNfEletMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoNfeletSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		nf = ProdutoNfelet.objects.filter(despesa=self.get_object(pk))
		serializer_context = {
			'request': request,
		}
		serializer = ProdutoNfeletSerializer(nf, context=serializer_context, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

class ProdutoNotaFiscalEletDelete(ProdutoNfEletMixin, generics.RetrieveUpdateAPIView):
	#queryset = Cheque.objects.filter(director=request.user)
	serializer_class = ProdutoNfeletSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get_object(self, pk):
		try:
			return ProdutoNfelet.objects.get(pk=pk)
		except ProdutoNfelet.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def post(self, request, format=None):
		return Response('Não permitido', status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		produto = self.get_object(pk)
		produto.delete()
		return Response("Deletado", status=status.HTTP_204_NO_CONTENT)


class AuditarDespesa(DespesaMixin, generics.RetrieveUpdateAPIView):

	serializer_class = DespesaSerializer
	authentication_classes = (ExpiringTokenAuthentication,)
	
	def get_object(self, pk):
		try:
			return Despesa.objects.get(pk=pk)
		except Despesa.DoesNotExist:
			raise Http404

	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def put(self, request, pk, format=None):
		despesa = self.get_object(pk)
		resposta = Auditoria_despesas(Auditoria_despesas, request, despesa)
		return resposta


class consultar_nfe_io(generics.ListCreateAPIView):

	authentication_classes = (ExpiringTokenAuthentication,)
	
	def get(self, request, format=None):
		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

	def post(self, request, format=None):
		url = "http://nfe.api.nfe.io/v1/productinvoices/" + request.data
		url += "?apikey=" + settings.CHAVE_API
		print(url)
		#Transformando bytes em texto string
		resp_text = urllib.request.urlopen(url).read().decode('UTF-8')
		#Transformando string em json
		response = json.loads(resp_text)

		return Response(response, status=status.HTTP_200_OK)


# def consultar_nfe_io(request, chave):
#     url = "http://nfe.api.nfe.io/v1/productinvoices/" + chave
#     url += "?apikey=" + settings.CHAVE_API

#     #Transformando bytes em texto string
#     resp_text = urllib.request.urlopen(url).read().decode('UTF-8')
#     #Transformando string em json
#     response = json.loads(resp_text)
#     print(response['items'][0])

#     return response['protocol']
