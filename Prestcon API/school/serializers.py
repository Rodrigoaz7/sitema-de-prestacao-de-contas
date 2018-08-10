from rest_framework import serializers, fields
from accounts.models import User
from .models import School
from vigencia.models import Vigencia
from accounts.serializers import UserSerializer
from vigencia.serializers import VigenciaSerializer
from .validators import *


class SchoolDetailSerializer(serializers.HyperlinkedModelSerializer):
	
	director = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	director = UserSerializer()
	vigencia = VigenciaSerializer()

	class Meta:
		model = School
		fields = ('pk', 'code', 'name', 'cnpj', 'type_school', 'director', 'vigencia', 
			'classification_school', 'state', 'city')



class SchoolSerializer(serializers.HyperlinkedModelSerializer):
	
	director = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())

	class Meta:
		model = School
		fields = ('pk', 'code', 'name', 'cnpj', 'type_school', 'director', 'vigencia', 
			'classification_school', 'state', 'city')

	def create(self, validated_data, user, vig):

		if validated_data['classification_school'] == "estadual":
			validated_data['city'] = " "

		school = School.objects.create(
			name=validated_data['name'],
			cnpj=validated_data['cnpj'],
			code=validated_data['code'],
			type_school=validated_data['type_school'],
			classification_school=validated_data['classification_school'],
			state=validated_data['state'],
			city=validated_data['city'],
			director=user,
			vigencia=vig
		)

		school.save()
		return school

	def create_normal(self, validated_data):

		if not ValidarClassificacaoEscola(validated_data['classification_school']):
			raise serializers.ValidationError({
				'classification_school': 'Classificacao invalida.'
			})
		if not ValidarTipoEscola(validated_data['type_school']):
			raise serializers.ValidationError({
				'type_school': 'Tipo inválido.'
			})
		# if validated_data['classification_school'] == "estadual":
		# 	validated_data['city'] = " "

		school = School.objects.create(
			name=validated_data['name'],
			cnpj=validated_data['cnpj'],
			code=validated_data['code'],
			type_school=validated_data['type_school'],
			classification_school=validated_data['classification_school'],
			state=validated_data['state'],
			city=validated_data['city'],
			director=User.objects.get(username=validated_data['director']),
			vigencia=Vigencia.objects.get(pk=validated_data['vigencia'])
		)

		school.save()
		return school

#Serializer para cadastro de diretor/escola ao mesmo tempo
class RegisterSerializer(serializers.HyperlinkedModelSerializer):

	director = UserSerializer(required=True)
	#school = SchoolSerializer(required=True)

	class Meta:
		model = Vigencia
		fields = (
			'director', 'initial_date', 'final_date'
		)

	# def to_internal_value(self, data):
		
	# 	# ---------- VALIDATOR FOR DIRECTORS ------------
	# 	if data['director']['username']:
	# 		username = data['director']['username']
	# 		if not ValidarCPF(username):
	# 			raise serializers.ValidationError({
	# 				'username': 'CPF invalido.'
	# 			})

	# 	if not data['director']['password']:
	# 		raise serializers.ValidationError({
	# 			'password': 'É necessário uma senha.'
	# 		})
	# 	else:
	# 		senha = data['director']['password']
	# 		if not ValidarSenha(senha):
	# 			raise serializers.ValidationError({
	# 				'password': 'Senha inválida. A senha precisa ter pelo menos 6 caracteres e conter caracteres e números.'
	# 			})

	# 	if not data['director']['email']:
	# 		raise serializers.ValidationError({
	# 			'email': 'É necessário um email.'
	# 		})
	# 	else:
	# 		email = data['director']['email']

	# 	#------------ VALIDATOR FOR SCHOOLS -------------
	# 	if not data['school']['classification_school']:
	# 		raise serializers.ValidationError({
	# 			'classification_school': 'Classificação obrigatória.'
	# 		})
	# 	else:
	# 		classificacao = data['school']['classification_school']
	# 		if not ValidarClassificacaoEscola(classificacao):
	# 			raise serializers.ValidationError({
	# 				'classification_school': 'Classificacao invalida.'
	# 			})

	# 	if not data['school']['type_school']:
	# 		raise serializers.ValidationError({
	# 			'type_school': 'Tipo da escola é obrigatório.'
	# 		})
	# 	else:
	# 		tipo = data['school']['type_school']
	# 		if not ValidarTipoEscola(tipo):
	# 			raise serializers.ValidationError({
	# 				'type_school': 'Tipo inválido.'
	# 			})

	# 	print("EIEIEIEEIEIEIEIE")
	# 	return {
	# 	    "final_date": data['final_date'],
	# 	    "initial_date": data['initial_date'],
	# 	    "director": {
	# 	    	"name": data['director']['name'],
	# 	        "telefone": data['director']['name'],
	# 	        "username": username,
	# 	        "password": senha,
	# 	        "email": email
	# 	    },
	# 	    "school": {
	# 	    	"name": data['school']['name'],
	# 	    	"cnpj": data['school']['cnpj'],
	# 	    	"code": data['school']['code'],
	# 	    	"classification_school": classificacao,
	# 		    "type_school": tipo,
	# 	    	"state": data['school']['state'],
	# 	    	"city": data['school']['city']
	# 	    }
 #        }

	def create(self, validated_data):
		user_data = validated_data['director']

		if not ValidarCPF(user_data['username']):
			raise serializers.ValidationError({
				'username': 'CPF invalido.'
			})
		if not ValidarSenha(user_data['password']):
			raise serializers.ValidationError({
				'password': 'Senha inválida. A senha precisa ter pelo menos 6 caracteres e conter caracteres e números.'
			})
		if not ValidarClassificacaoEscola(validated_data['school']['classification_school']):
			raise serializers.ValidationError({
				'classification_school': 'Classificacao invalida.'
			})
		if not ValidarTipoEscola(validated_data['school']['type_school']):
			raise serializers.ValidationError({
				'type_school': 'Tipo inválido.'
			})
			
		user = UserSerializer.create(UserSerializer(), validated_data=user_data)
		vigencia = Vigencia.objects.create(
			initial_date = validated_data['initial_date'],
			final_date = validated_data['final_date'],
			director = user
		)
		vigencia.save()

		escola = SchoolSerializer.create(SchoolSerializer(), validated_data=validated_data['school'], user=user, vig=vigencia)
		
		return user


		