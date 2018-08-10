from django.db import models
from accounts.models import User

class Bank_account(models.Model):

    bank_code = models.CharField('Código do banco', max_length=5)
    bank = models.CharField('Nome do banco', max_length=100)
    agencia = models.CharField('Agência', max_length=50)
    digito_agencia = models.CharField('Dígito do número da agência', max_length=10)
    account_number = models.CharField('Número da conta', max_length=50)
    digito_account_number = models.CharField('Dígito do número da conta', max_length=10)
    code = models.CharField('Código da fonte pagadora', max_length=50)
    name = models.CharField('Nome da conta', max_length=100)
    director = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="director_bank_account", verbose_name="Conta do diretor",default="diretor", db_column='director', null=True)
    vigencia = models.ForeignKey('vigencia.Vigencia', on_delete=models.CASCADE, null=True, related_name="vigencia_bank", verbose_name="Vigência da conta bancária")
    created = models.DateTimeField('Criado em', auto_now_add=True)

    #retornando o numero da conta bancária para chave estrangeira
    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = 'Conta bancária'
        verbose_name_plural = 'Contas bancárias'

