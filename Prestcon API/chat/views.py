from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.http import Http404
from rest_framework import status
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from accounts.permissions import *
from django.db.models import Q


class RoomViewSet(viewsets.ModelViewSet):
	queryset = Room.objects.all()
	serializer_class = RoomSerializer

# Class with Mixin
class RoomMixin(object):
	queryset = Room.objects.all()
	serializer_class = RoomSerializer

class ChatViewSet(viewsets.ModelViewSet):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer

# Class with Mixin
class ChatMixin(object):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer


# Esta classe ira retornar TODAS as mensagens relacionados ao user logado
class AllMessagesRoom(ChatMixin, generics.ListCreateAPIView):

	serializer_class = MessageSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		mensagens = Message.objects.filter(Q(sender=request.user) | Q(reciever=request.user)).order_by('-data_envio')
		serializer = MessageSerializer(mensagens, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response("Proibido para esta url", status=status.HTTP_403_FORBIDDEN)


# Esta classe ira retornar TODAS as mensagens relacionados ao user logado de uma sala especifica
class AllMessagesFromRoom(RoomMixin, generics.ListCreateAPIView):

	serializer_class = MessageSerializer
	authentication_classes = (ExpiringTokenAuthentication,)
	
	def get_room(self, pk):
		try:
			return Room.objects.get(pk=pk)
		except Room.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		mensagens = Message.objects.filter(from_room=self.get_room(pk))
		mensagens.filter(Q(sender=request.user) | Q(reciever=request.user)).order_by('-data_envio')
		serializer = MessageSerializer(mensagens, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = MessageSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retorna todas as mensagens nao lidas pelo usuario
class MessagesNotReadList(ChatMixin, generics.ListCreateAPIView):

	serializer_class = MessageSerializer
	authentication_classes = (ExpiringTokenAuthentication,)

	def get(self, request, format=None):
		mensagens = Message.objects.filter(reciever=request.user, visualizada=False).order_by('-data_envio')
		serializer = MessageSerializer(mensagens, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		return Response("Proibido para esta url", status=status.HTTP_403_FORBIDDEN)
