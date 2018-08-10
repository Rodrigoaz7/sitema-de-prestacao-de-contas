from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.HyperlinkedModelSerializer):
	pass

class MessageSerializer(serializers.HyperlinkedModelSerializer):
	pass