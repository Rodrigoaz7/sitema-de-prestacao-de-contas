from rest_framework import viewsets, generics, mixins
from .models import Cheque, BlocoCheques
from .serializers import ChequeSerializer, BlocoChequeSerializer
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from accounts.models import User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication


class ChequeViewSet(viewsets.ModelViewSet):
    queryset = BlocoCheques.objects.all()
    serializer_class = BlocoChequeSerializer

# Class with Mixin
class ChequeMixin(object):
    queryset = BlocoCheques.objects.all()
    serializer_class = BlocoChequeSerializer

class ChequeMixin2(object):
    queryset = Cheque.objects.all()
    serializer_class = ChequeSerializer

class ChequeList(ChequeMixin, generics.ListCreateAPIView):

    serializer_class = BlocoChequeSerializer
    authentication_classes = (ExpiringTokenAuthentication,)
    
    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
        if not request.user.is_superuser:
            cheque = BlocoCheques.objects.filter(director=request.user)
        else:
            cheque = BlocoCheques.objects.all()

        serializer = BlocoChequeSerializer(cheque, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)


class ChequePost(ChequeMixin, generics.ListCreateAPIView):
    #queryset = Cheque.objects.filter(director=request.user)
    serializer_class = BlocoChequeSerializer
    authentication_classes = (ExpiringTokenAuthentication,)
    
    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response('Você precisa logar para ter acesso', status=status.HTTP_401_UNAUTHORIZED) 
        if not request.user.is_superuser:
            cheque = BlocoCheques.objects.filter(director=request.user)
        else:
            cheque = BlocoCheques.objects.all()

        serializer = BlocoChequeSerializer(cheque, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):

        serializer = BlocoChequeSerializer(data=request.data)
        serializer2 = ChequeSerializer(data=request.data)

        if serializer.is_valid():
            pk = serializer.create(request.data, request.user)
            serializer2.create(request.data, pk)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListChequesView(ChequeMixin2, generics.RetrieveUpdateAPIView):

    serializer_class = ChequeSerializer
    authentication_classes = (ExpiringTokenAuthentication,)
    #lookup_field = "pk"

    def get_object(self, pk):
        try:
            return BlocoCheques.objects.get(pk=pk)
        except BlocoCheques.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        bloco = self.get_object(pk)
        if(bloco.director == request.user or request.user.is_superuser):
            #cheques = Cheque.objects.filter(blococheque=bloco).filter(status=True)
            cheques = Cheque.objects.filter(blococheque=bloco)
            serializer_context = {
                'request': request,
            }
            serializer = ChequeSerializer(cheques, context=serializer_context, many=True)
            return Response(serializer.data)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk, format=None):
        #bloco = self.get_object(pk)
        if(bloco.director == request.user or request.user.is_superuser):
            cheque = Cheque.objects.get(pk=pk)
            serializer = ChequeSerializer(cheque, data=request.data)
            if serializer.is_valid():
                serializer.update(id_cheque)
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, format=None):
        return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)


class ChequeUpdateView(ChequeMixin, generics.RetrieveUpdateAPIView):
    #queryset = Cheque.objects.all()
    serializer_class = BlocoChequeSerializer
    authentication_classes = (ExpiringTokenAuthentication,)

    def get_object(self, pk):
        try:
            return BlocoChequeSerializer.objects.get(pk=pk)
        except Cheque.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        cheque = self.get_object(pk)
        if(cheque.director == request.user or request.user.is_superuser):
            serializer = ChequeSerializer(cheque)
            return Response(serializer.data)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        cheque = self.get_object(pk)
        if(request.user.is_superuser):
            cheque.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def put(self, request, format=None):
        return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)

class ChequeDeleteView(ChequeMixin, generics.RetrieveUpdateAPIView):
    #queryset = Cheque.objects.all()
    serializer_class = ChequeSerializer
    authentication_classes = (ExpiringTokenAuthentication,)

    def get_object(self, pk):
        try:
            return Cheque.objects.get(pk=pk)
        except Cheque.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        cheque = self.get_object(pk)
        if(cheque.director == request.user or request.user.is_superuser):
            serializer = ChequeSerializer(cheque)
            return Response(serializer.data)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        cheque = self.get_object(pk)
        if(request.user.is_superuser):
            cheque.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response('Você está tentando acessar um usuário sem permissão.', 
                status=status.HTTP_403_FORBIDDEN)

    def put(self, request, format=None):
        return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)