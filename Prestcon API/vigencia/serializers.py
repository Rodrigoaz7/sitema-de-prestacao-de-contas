from rest_framework import serializers
from .models import Vigencia
from accounts.models import User


class VigenciaSerializer(serializers.HyperlinkedModelSerializer):

	director = serializers.SlugRelatedField(slug_field='username', many=False, queryset=User.objects.all())
	
	class Meta:
		model = Vigencia
		fields = ('pk','initial_date','final_date','director')

	def create(self, validated_data, user):
		vigencia = Vigencia.objects.create(
			initial_date=validated_data['initial_date'],
			final_date=validated_data['final_date'],
			director=user
		)
		vigencia.save()

		return vigencia

	def create_normal(self,validated_data):
		vigencia = Vigencia.objects.create(
			initial_date=validated_data['initial_date'],
			final_date=validated_data['final_date'],
			director=User.objects.get(username=validated_data['director'])
		)
		vigencia.save()

		return vigencia