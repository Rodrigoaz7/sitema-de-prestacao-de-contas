from rest_framework import serializers
from .models import Certidao
from fornecedor.models import Fornecedor
from datetime import date, datetime

class CertidaoSerializer(serializers.HyperlinkedModelSerializer):

	certidao_fornecedor = serializers.SlugRelatedField(slug_field='cnpj', many=False, queryset=Fornecedor.objects.all())

	class Meta:
		model = Certidao
		fields = ('pk','name','tipo','inicio_validade','final_validade', 'certidao_fornecedor','codigo_unico',
		 'is_auditada','file')

	def create(self, forn):
		now = datetime.now()
		certidao = Certidao.objects.create(
			name="Certidão da Receita Federal",
			tipo="União",
			inicio_validade="",
			final_validade="",
			certidao_fornecedor=forn,
			is_auditada=False,
			codigo_unico=str(forn.cnpj+forn.vigencia.director.username+"União"+"ReceitaFederal"+forn.school.cnpj+('%02d:%02d.%d'%(now.minute,now.second,now.microsecond))[:-4])
		)
		certidao.save()
		certidao1 = Certidao.objects.create(
			name="Certidão da tributação estadual",
			tipo="Estado",
			inicio_validade="",
			final_validade="",
			certidao_fornecedor=forn,
			is_auditada=False,
			codigo_unico=str(forn.cnpj+forn.vigencia.director.username+"Estado"+"CertidaoTributacaoEstadual"+forn.school.cnpj+('%02d:%02d.%d'%(now.minute,now.second,now.microsecond))[:-4])
		)
		certidao1.save()
		certidao2 = Certidao.objects.create(
			name="Certidão da tributação municipal",
			tipo="Município",
			inicio_validade="",
			final_validade="",
			certidao_fornecedor=forn,
			is_auditada=False,
			codigo_unico=str(forn.cnpj+forn.vigencia.director.username+"Município"+"CertidaoTributacaoMunicipal"+forn.school.cnpj+('%02d:%02d.%d'%(now.minute,now.second,now.microsecond))[:-4])
		)
		certidao2.save()
		certidao3 = Certidao.objects.create(
			name="Certidão de débitos trabalhistas",
			tipo="União",
			inicio_validade="",
			final_validade="",
			certidao_fornecedor=forn,
			is_auditada=False,
			codigo_unico=str(forn.cnpj+forn.vigencia.director.username+"União"+"CertidaoDebitosTrabalhistas"+forn.school.cnpj+('%02d:%02d.%d'%(now.minute,now.second,now.microsecond))[:-4])
		)
		certidao3.save()
		certidao4 = Certidao.objects.create(
			name="Certidão do FGTS",
			tipo="União",
			inicio_validade="",
			final_validade="",
			certidao_fornecedor=forn,
			is_auditada=False,
			codigo_unico=str(forn.cnpj+forn.vigencia.director.username+"União"+"CertidaoFGTS"+forn.school.cnpj+('%02d:%02d.%d'%(now.minute,now.second,now.microsecond))[:-4])
		)
		certidao4.save()