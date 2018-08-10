from django.db import models
from datetime import date

class Certidao(models.Model):

	name = models.CharField("nome da certidão", max_length=100)
	tipo = models.CharField("tipo da certidão", max_length=20)
	certidao_fornecedor = models.ForeignKey('fornecedor.Fornecedor', on_delete=models.CASCADE)
	inicio_validade = models.CharField("Data de início da validade da certidão", max_length=10, blank=True)
	final_validade = models.CharField("Data final da validade da certidão", max_length=10, blank=True)
	file = models.FileField("Arquivo", upload_to='uploads/arquivos', null=True, blank=True)
	codigo_unico = models.CharField("Código único", max_length=100, unique=True, blank=True)
	is_auditada = models.BooleanField("Certidão auditada", default=False)

	def __str__(self):
		return self.name

	class Meta:
		verbose_name = "Certidão"
		verbose_name_plural = "Certidões"