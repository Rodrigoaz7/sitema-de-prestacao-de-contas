from rest_framework import serializers
from .models import *
#from django.contrib.auth import login

class UserSerializer(serializers.HyperlinkedModelSerializer):

	password = serializers.CharField(write_only=True)

	def create(self, validated_data):

		user = User.objects.create(
			email=validated_data['email'],
			username=validated_data['username'],
			name=validated_data['name'],
			telefone=validated_data['telefone'],
			is_diretor=True
		)
		user.set_password(validated_data['password'])

		diretor = UserDiretor.objects.create(user=user)
		user.save()
		diretor.save()

		return user

	def update(self, validated_data):

		user = User.objects.get(username=validated_data['username'])
		user.name = validated_data['name']
		user.username = validated_data['username']
		user.email = validated_data['email']
		user.telefone = validated_data['telefone']
		user.set_password(validated_data['password'])
		user.save()

		return user

	class Meta:
		model = User
		fields = ('pk','username', 'password', 'name', 'telefone', 'email','is_superuser', 'is_diretor', 
		'is_secretario', 'is_auditor')


class UserDiretorSerializer(serializers.HyperlinkedModelSerializer):
	#user = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	user = UserSerializer(required=True)
	
	class Meta:
		model = UserDiretor
		fields = ('user',)


class UserSecretariaSerializer(serializers.HyperlinkedModelSerializer):
	
	user = UserSerializer(required=True)

	def update(self, validated_data, secretaria):
		default_user = UserSerializer()
		default_user = default_user.update(validated_data['user'])
		secretaria.tipo = validated_data['tipo']
		secretaria.cidade = validated_data['cidade']
		secretaria.estado = validated_data['estado']
		secretaria.user = default_user
		secretaria.save()

		return secretaria

	class Meta:
		model = UserSecretaria
		fields = ('user', 'tipo', 'cidade', 'estado', 'is_valid')


class UserAuditorSerializer(serializers.HyperlinkedModelSerializer):
	
	user = UserSerializer(required=True)
	secretaria = UserSecretariaSerializer(required=True)

	def update(self, validated_data, secretaria, auditor):
		default_user = UserSerializer()
		default_user = default_user.update(validated_data['user'])
		auditor.is_auditor_despesa = validated_data['is_auditor_despesa']
		auditor.is_auditor_receita = validated_data['is_auditor_receita']
		auditor.is_auditor_certidao = validated_data['is_auditor_certidao']
		auditor.user = default_user
		auditor.secretaria = secretaria
		auditor.save()

		return auditor
	
	class Meta:
		model = UserAuditor
		fields = ('user', 'secretaria', 'is_auditor_despesa', 'is_auditor_receita', 'is_auditor_certidao')


class UserMasterSerializer(serializers.HyperlinkedModelSerializer):
	
	user = UserSerializer(required=True)
	
	class Meta:
		model = UserMaster
		fields = ('user',)

class UserDesenvolvedorSerializer(serializers.HyperlinkedModelSerializer):
	
	user = UserSerializer(required=True)
	
	class Meta:
		model = UserDesenvolvedor
		fields = ('user',)