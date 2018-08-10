from django.db import models
from accounts.models import User
from datetime import datetime


class Vigencia(models.Model):

	initial_date = models.CharField("Data de início de vigência", max_length=10)
	final_date = models.CharField("Data de final de vigência", max_length=10)
	director = models.ForeignKey("accounts.User", on_delete=models.CASCADE, blank=True, null=True, related_name="director_vigencia", verbose_name="Conta do diretor")

	def __str__(self):
		return '{0} - {1}'.format(self.initial_date, self.final_date) or self.pk

	class Meta:
		verbose_name = "Vigência"
		verbose_name_plural = "Vigências"