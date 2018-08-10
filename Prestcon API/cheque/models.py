from django.db import models
from accounts.models import User
from bank.models import Bank_account

class BlocoCheques(models.Model):

    account = models.ForeignKey('bank.Bank_account', on_delete=models.CASCADE, default="", related_name="number_of_account", verbose_name="nome da conta")
    director = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="director_cheque", verbose_name="Cheque do diretor",default="diretor", db_column='director')
    initial_numbers = models.CharField('Numeração inicial do cheque', max_length=50)
    last_numbers = models.CharField('Numeração final do cheque', max_length=50)
    vigencia = models.ForeignKey('vigencia.Vigencia', on_delete=models.CASCADE, null=True, related_name="vigencia_cheque", verbose_name="Vigência do bloco de cheques")

    #retornando o numero da conta bancária para chave estrangeira
    def __str__(self):
        return '#{0} - {1}'.format(self.initial_numbers, self.last_numbers) or self.pk

    class Meta:
        verbose_name = 'Bloco de cheque'
        verbose_name_plural = 'Blocos de cheques'

class Cheque(models.Model):

	number = models.CharField('Número do cheque', max_length=25, default=0)
	status = models.BooleanField('Disponível', default=True)
	blococheque = models.ForeignKey('BlocoCheques', on_delete=models.CASCADE, related_name="blococheque", verbose_name="Cheque do bloco",null=True, db_column='blococheque')
	created = models.DateTimeField('Criado em', auto_now_add=True)
	
	def __str__(self):
		return '{0} : {1}'.format(self.blococheque, self.number) or self.number

	class Meta:
		verbose_name = 'Cheque'
		verbose_name_plural = 'Cheques'
