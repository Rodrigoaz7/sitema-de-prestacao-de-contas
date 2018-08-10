from django.db import models

class Fornecedor(models.Model):

	name = models.CharField("nome do fornecedor", max_length=100)
	cnpj = models.CharField("CNPJ", max_length=50, unique=True)
	telefone = models.CharField("telefone do fornecedor", max_length=25, blank=True)
	email = models.EmailField("Email do fornecedor", blank=True)
	endereco = models.CharField("Endereço do fornecedor", max_length=300)
	vigencia = models.ForeignKey('vigencia.Vigencia', null=True, on_delete=models.CASCADE)
	school = models.ForeignKey('school.School', null=True, on_delete=models.CASCADE)

	def __str__(self):
		return self.name or self.cnpj

	class Meta:
		verbose_name = "Fornecedor"
		verbose_name_plural = "Fornecedores"
