from rest_framework import serializers
from accounts.models import User
from .models import Bank_account
from vigencia.models import Vigencia
from vigencia.serializers import VigenciaSerializer
from accounts.serializers import UserSerializer


class BankListSerializer(serializers.HyperlinkedModelSerializer):
#Usando devido a chave estrangeira de director
	director = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	director = UserSerializer()
	vigencia = VigenciaSerializer()

	class Meta:
		model = Bank_account
		fields = ('pk','bank_code','bank','agencia', 'account_number', 'code', 'name', 'director', 
			'vigencia', 'digito_agencia', 'digito_account_number')


class BankSerializer(serializers.HyperlinkedModelSerializer):
#Usando devido a chave estrangeira de director
	director = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())

	class Meta:
		model = Bank_account
		fields = ('pk','bank_code','bank','agencia', 'account_number', 'code', 'name', 'director', 
			'vigencia', 'digito_agencia', 'digito_account_number')

