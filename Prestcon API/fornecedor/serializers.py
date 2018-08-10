from rest_framework import serializers
from .models import Fornecedor
from vigencia.models import Vigencia
from school.models import School
#from certidao.models import Certidao

class FornecedorSerializer(serializers.HyperlinkedModelSerializer):

	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	school = serializers.PrimaryKeyRelatedField(many=False, queryset=School.objects.all())

	class Meta:
		model = Fornecedor
		fields = ('pk','name', 'cnpj', 'email','telefone', 'endereco','vigencia', 'school')

	def create(self, validated_data):
		fornecedor = Fornecedor.objects.create(
			name=validated_data['name'],
			cnpj=validated_data['cnpj'],
			email=validated_data['email'],
			telefone=validated_data['telefone'],
			endereco=validated_data['endereco'],
			vigencia=Vigencia.objects.get(pk=validated_data['vigencia']),
			school=School.objects.get(pk=validated_data['school'])
		)
		fornecedor.save()
		return fornecedor