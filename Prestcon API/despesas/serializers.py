from rest_framework import serializers
from .models import *
from school.models import School
from bank.models import Bank_account
from bank.serializers import BankSerializer
#from cheque.models import Cheque, BlocoCheques
from vigencia.models import Vigencia
from fornecedor.models import Fornecedor
from fornecedor.serializers import FornecedorSerializer
import json


#Serializer only for list
class DespesaListSerializer(serializers.HyperlinkedModelSerializer):
	school = serializers.SlugRelatedField(slug_field='name', many=False, queryset=School.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	fornecedor = serializers.SlugRelatedField(slug_field='cnpj', many=False, queryset=Fornecedor.objects.all())
	fornecedor = FornecedorSerializer()
	bank = serializers.PrimaryKeyRelatedField(many=False, queryset=Bank_account.objects.all())
	bank = BankSerializer()

	class Meta:
		model = Despesa
		fields = ('pk', 'tipo_despesa', 'school', 'fornecedor', 'vigencia', 'bank',
			'tipo_documento', 'tipo_nota_fiscal','num_comprovante_pag',
			'data_comprovante_pag', 'file_comprovante','file_proposta1','file_proposta2',
			'file_proposta3','file_tipo_documento', 'file_recibo', 'file_outros', 'is_auditada')


class DespesaSerializer(serializers.HyperlinkedModelSerializer):
	school = serializers.SlugRelatedField(slug_field='name', many=False, queryset=School.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	fornecedor = serializers.SlugRelatedField(slug_field='cnpj', many=False, queryset=Fornecedor.objects.all())
	bank = serializers.PrimaryKeyRelatedField(many=False, queryset=Bank_account.objects.all())
	#cheque = serializers.PrimaryKeyRelatedField(many=False, queryset=Cheque.objects.all())
	#bloco_cheque = serializers.PrimaryKeyRelatedField(many=False, queryset=BlocoCheques.objects.all())

	class Meta:
		model = Despesa
		fields = ('pk', 'tipo_despesa', 'school', 'fornecedor', 'vigencia', 'bank',
			'tipo_documento', 'tipo_nota_fiscal','num_comprovante_pag',
			'data_comprovante_pag', 'file_comprovante','file_proposta1','file_proposta2',
			'file_proposta3','file_tipo_documento', 'file_recibo', 'file_outros', 'is_auditada')


	def create(self, validated_data):

		despesa = Despesa.objects.create(
			tipo_despesa=validated_data['tipo_despesa'],
			tipo_documento=validated_data['tipo_documento'],
			tipo_nota_fiscal=validated_data['tipo_nota_fiscal'],
			num_comprovante_pag=validated_data['num_comprovante_pag'],
			data_comprovante_pag=validated_data['data_comprovante_pag'],
			file_comprovante=validated_data['file_comprovante'],
			file_proposta1=validated_data['file_proposta1'],
			file_proposta2=validated_data['file_proposta2'],
			file_proposta3=validated_data['file_proposta3'],
			file_tipo_documento=validated_data['file_tipo_documento'],
			file_recibo=validated_data['file_recibo'],
			file_outros=validated_data['file_outros'],
			vigencia=Vigencia.objects.get(pk=validated_data['vigencia']),
			school=School.objects.get(name=validated_data['school']),
			fornecedor=Fornecedor.objects.get(cnpj=validated_data['fornecedor']),
			bank=Bank_account.objects.get(pk=validated_data['bank']),
			is_auditada=False
		)
		print(len(validated_data['name']))
		validated_data = dict(validated_data._iterlists())

		validated_data['name'] = json.loads(str(validated_data['name'][0]))
		validated_data['valor_unitario'] = json.loads(str(validated_data['valor_unitario'][0]))
		validated_data['valor_total'] = json.loads(str(validated_data['valor_total'][0]))
		validated_data['unidades'] = json.loads(str(validated_data['unidades'][0]))
		validated_data['tipo_unidade'] = json.loads(str(validated_data['tipo_unidade'][0]))
		print(len(validated_data['name']))
		if validated_data['tipo_documento'][0] == "Fatura":
			despesa.save()
			i=0
			while i < int(validated_data['num_produtos'][0]):

				produtofat = ProdutoFat.objects.create(
					despesa=despesa,
					name=str(validated_data['name'][i]),
					valor_unitario=float(validated_data['valor_unitario'][i]),
					valor_total=float(validated_data['valor_total'][i]),
					unidades=int(validated_data['unidades'][i]),
					tipo_unidade=str(validated_data['tipo_unidade'][i])
				)
				produtofat.save()
				i=i+1

		elif validated_data['tipo_documento'][0] == "Recibo":
			despesa.save()
			i=0
			while i < int(validated_data['num_produtos'][0]):
				produtorec = ProdutoRec.objects.create(
					despesa=despesa,
					name=str(validated_data['name'][i]),
					valor_unitario=float(validated_data['valor_unitario'][i]),
					valor_total=float(validated_data['valor_total'][i]),
					unidades=int(validated_data['unidades'][i]),
					tipo_unidade=str(validated_data['tipo_unidade'][i])
				)
				produtorec.save()
				i=i+1

		else:
			if validated_data['tipo_nota_fiscal'][0] == "Manual":
				despesa.save()
				i=0
				while i < int(validated_data['num_produtos'][0]):
					produtonf = ProdutoNf.objects.create(
						despesa=despesa,
						name=str(validated_data['name'][i]),
						valor_unitario=float(validated_data['valor_unitario'][i]),
						valor_total=float(validated_data['valor_total'][i]),
						unidades=int(validated_data['unidades'][i]),
						tipo_unidade=str(validated_data['tipo_unidade'][i])
					)
					produtonf.save()
					i=i+1
			else:
				validated_data['ncm'] = json.loads(str(validated_data['ncm'][0]))
				validated_data['cst'] = json.loads(str(validated_data['cst'][0]))
				validated_data['cfop'] = json.loads(str(validated_data['cfop'][0]))

				despesa.save()
				i=0

				while i < int(validated_data['num_produtos'][0]):
					produtonfe = ProdutoNfelet.objects.create(
						despesa=despesa,
						name=str(validated_data['name'][i]),
						valor_unitario=float(validated_data['valor_unitario'][i]),
						valor_total=float(validated_data['valor_total'][i]),
						unidades=int(validated_data['unidades'][i]),
						tipo_unidade=str(validated_data['tipo_unidade'][i]),
						cfop=str(validated_data['cfop'][i]),
						o_cst=str(validated_data['cst'][i]),
						ncm_sh=str(validated_data['ncm'][i])
					)
					produtonfe.save()
					i=i+1


		return despesa


# ==================== SERIALIZERS DOS PRODUTOS =============================== 

class ProdutoNfSerializer(serializers.HyperlinkedModelSerializer):
	#Usando chame primária, pois __str__ não funciona em JSON
	despesa = serializers.PrimaryKeyRelatedField(many=False, queryset=Despesa.objects.all())
	despesa = DespesaListSerializer()
	
	class Meta:
		model = ProdutoNf
		fields = ('pk','despesa','name', 'unidades', 'valor_unitario', 'valor_total', 'tipo_unidade')

	def update(self, validated_data):
		doc = ProdutoNf.objects.filter(despesa=validated_data['despesa'])
		i=0

		validated_data = dict(validated_data._iterlists())
		validated_data['name'] = json.loads(str(validated_data['name'][0]))
		validated_data['valor_unitario'] = json.loads(str(validated_data['valor_unitario'][0]))
		validated_data['valor_total'] = json.loads(str(validated_data['valor_total'][0]))
		validated_data['unidades'] = json.loads(str(validated_data['unidades'][0]))
		validated_data['tipo_unidade'] = json.loads(str(validated_data['tipo_unidade'][0]))

		#tenho um produto, então o while só vai rodar uma vez para atualiza-lo
		while i < len(doc):
			doc[i].name = str(validated_data['name'][i])
			doc[i].unidades = int(validated_data['unidades'][i])
			doc[i].valor_unitario = float(validated_data['valor_unitario'][i])
			doc[i].valor_total = float(validated_data['valor_total'][i])
			doc[i].tipo_unidade = str(validated_data['tipo_unidade'][i])
			doc[i].save()
			i=i+1

		while i < int(validated_data['num_produtos'][0]):
			obj = ProdutoNf.objects.create(
				name=str(validated_data['name'][i]),
				unidades=int(validated_data['unidades'][i]),
				valor_unitario=float(validated_data['valor_unitario'][i]),
				valor_total=float(validated_data['valor_total'][i]),
				despesa=Despesa.objects.get(pk=validated_data['despesa'][0]),
				tipo_unidade=str(validated_data['tipo_unidade'][i])
			)
			obj.save()
			i=i+1

		return doc

class ProdutoRecSerializer(serializers.HyperlinkedModelSerializer):
	#Usando chame primária, pois __str__ não funciona em JSON
	despesa = serializers.PrimaryKeyRelatedField(many=False, queryset=Despesa.objects.all())
	despesa = DespesaListSerializer()

	class Meta:
		model = ProdutoRec
		fields = ('pk', 'despesa','name', 'unidades', 'valor_unitario', 'valor_total', 'tipo_unidade')

	def update(self, validated_data):
		doc = ProdutoRec.objects.filter(despesa=validated_data['despesa'])
		i=0

		validated_data = dict(validated_data._iterlists())
		validated_data['name'] = json.loads(str(validated_data['name'][0]))
		validated_data['valor_unitario'] = json.loads(str(validated_data['valor_unitario'][0]))
		validated_data['valor_total'] = json.loads(str(validated_data['valor_total'][0]))
		validated_data['unidades'] = json.loads(str(validated_data['unidades'][0]))
		validated_data['tipo_unidade'] = json.loads(str(validated_data['tipo_unidade'][0]))

		#tenho um produto, então o while só vai rodar uma vez para atualiza-lo
		while i < len(doc):
			doc[i].name = str(validated_data['name'][i])
			doc[i].unidades = int(validated_data['unidades'][i])
			doc[i].valor_unitario = float(validated_data['valor_unitario'][i])
			doc[i].valor_total = float(validated_data['valor_total'][i])
			doc[i].tipo_unidade = str(validated_data['tipo_unidade'][i])
			doc[i].save()
			i=i+1

		while i < int(validated_data['num_produtos'][0]):
			obj = ProdutoRec.objects.create(
				name=str(validated_data['name'][i]),
				unidades=int(validated_data['unidades'][i]),
				valor_unitario=float(validated_data['valor_unitario'][i]),
				valor_total=float(validated_data['valor_total'][i]),
				despesa=Despesa.objects.get(pk=validated_data['despesa'][0]),
				tipo_unidade=str(validated_data['tipo_unidade'][i])
			)
			obj.save()
			i=i+1

		return doc

class ProdutoFatSerializer(serializers.HyperlinkedModelSerializer):
	#Usando chame primária, pois __str__ não funciona em JSON
	despesa = serializers.PrimaryKeyRelatedField(many=False, queryset=Despesa.objects.all())
	despesa = DespesaListSerializer()
	
	class Meta:
		model = ProdutoFat
		fields = ('pk', 'despesa','name', 'unidades', 'valor_unitario', 'valor_total', 'tipo_unidade')

	def update(self, validated_data):
		doc = ProdutoFat.objects.filter(despesa=validated_data['despesa'])
		i=0

		validated_data = dict(validated_data._iterlists())
		validated_data['name'] = json.loads(str(validated_data['name'][0]))
		validated_data['valor_unitario'] = json.loads(str(validated_data['valor_unitario'][0]))
		validated_data['valor_total'] = json.loads(str(validated_data['valor_total'][0]))
		validated_data['unidades'] = json.loads(str(validated_data['unidades'][0]))
		validated_data['tipo_unidade'] = json.loads(str(validated_data['tipo_unidade'][0]))

		#Atualizar linhas já adicionadas anteriormente
		while i < len(doc):
			doc[i].name = str(validated_data['name'][i])
			doc[i].unidades = int(validated_data['unidades'][i])
			doc[i].valor_unitario = float(validated_data['valor_unitario'][i])
			doc[i].valor_total = float(validated_data['valor_total'][i])
			doc[i].tipo_unidade = str(validated_data['tipo_unidade'][i])
			doc[i].save()
			i=i+1

		#Criar novas linhas, caso precise
		while i < int(validated_data['num_produtos'][0]):
			obj = ProdutoFat.objects.create(
				name=str(validated_data['name'][i]),
				unidades=int(validated_data['unidades'][i]),
				valor_unitario=float(validated_data['valor_unitario'][i]),
				valor_total=float(validated_data['valor_total'][i]),
				despesa=Despesa.objects.get(pk=validated_data['despesa'][0]),
				tipo_unidade=str(validated_data['tipo_unidade'][i])
			)
			obj.save()
			i=i+1

		return doc

class ProdutoNfeletSerializer(serializers.HyperlinkedModelSerializer):
	#Usando chame primária, pois __str__ não funciona em JSON
	despesa = serializers.PrimaryKeyRelatedField(many=False, queryset=Despesa.objects.all())
	despesa = DespesaListSerializer()
	
	class Meta:
		model = ProdutoNfelet
		fields = ('pk', 'despesa','name', 'unidades', 'valor_unitario', 'valor_total', 'tipo_unidade')

	def update(self, validated_data):
		doc = ProdutoNfelet.objects.filter(despesa=validated_data['despesa'])
		i=0

		validated_data = dict(validated_data._iterlists())
		validated_data['name'] = json.loads(str(validated_data['name'][0]))
		validated_data['valor_unitario'] = json.loads(str(validated_data['valor_unitario'][0]))
		validated_data['valor_total'] = json.loads(str(validated_data['valor_total'][0]))
		validated_data['unidades'] = json.loads(str(validated_data['unidades'][0]))

		#tenho um produto, então o while só vai rodar uma vez para atualiza-lo
		while i < len(doc):
			doc[i].name = str(validated_data['name'][i])
			doc[i].unidades = int(validated_data['unidades'][i])
			doc[i].valor_unitario = float(validated_data['valor_unitario'][i])
			doc[i].valor_total = float(validated_data['valor_total'][i])
			doc[i].save()
			i=i+1

		while i < int(validated_data['num_produtos'][0]):
			obj = ProdutoNf.objects.create(
				name=str(validated_data['name'][i]),
				unidades=int(validated_data['unidades'][i]),
				valor_unitario=float(validated_data['valor_unitario'][i]),
				valor_total=float(validated_data['valor_total'][i]),
				despesa=Despesa.objects.get(pk=validated_data['despesa'][0])
			)
			obj.save()
			i=i+1

		return doc