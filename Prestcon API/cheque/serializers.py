from rest_framework import serializers
from accounts.models import User
from .models import Cheque, BlocoCheques
from bank.models import Bank_account
from accounts.serializers import UserSerializer
from bank.serializers import BankSerializer
from vigencia.models import Vigencia


class BlocoChequeSerializer(serializers.HyperlinkedModelSerializer):
	
	director = serializers.SlugRelatedField(slug_field='name', many=False, queryset=User.objects.all())
	account = serializers.SlugRelatedField(slug_field='name', many=False, queryset=Bank_account.objects.all())
	vigencia = serializers.PrimaryKeyRelatedField(many=False, queryset=Vigencia.objects.all())
	
	class Meta:
		model = BlocoCheques
		fields = ('pk','director', 'account', 'initial_numbers', 'last_numbers', 'vigencia')

	def create(self, validated_data, user):
		bloco = BlocoCheques.objects.create(
				initial_numbers=validated_data['initial_numbers'],
				last_numbers=validated_data['last_numbers'],
				director=user,
				vigencia=Vigencia.objects.get(pk=validated_data['vigencia']),
				account=Bank_account.objects.filter(name=validated_data['account']).filter(director=user)[0]
			)
		bloco.save()
		return bloco.pk


class ChequeSerializer(serializers.HyperlinkedModelSerializer):
	
	blococheque = BlocoChequeSerializer()

	class Meta:
		model = Cheque
		fields = ('pk', 'number', 'status', 'blococheque')

	def create(self, validated_data, obj):
		number_ = int(validated_data['initial_numbers'])

		while number_ <= int(validated_data['last_numbers']):

			cheque_ = Cheque.objects.create(
				number=number_,
				status=True,
				blococheque=BlocoCheques.objects.get(pk=obj)
			)
			cheque_.save()
			number_=number_+1

		return cheque_

	# Quando usar o cheque, devemos chamar esta função para desabilitar o status do cheque
	def update(self, id_cheque):
		cheque = Cheque.objects.get(pk=id_cheque)

		cheque.status = not cheque.status
		cheque.save()

		return cheque



