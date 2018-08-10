from django.db import models
import re
from django.core import validators
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin, BaseUserManager
from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
# from allauth.account.signals import user_logged_in
# from django.dispatch import receiver
# import logging

# logger = logging.getLogger(__username__)

# @receiver(user_logged_in, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(request, instance=None, created=True, **kwargs):
#     print("eyheyehehyehyeheyeyeh")
#     Token.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
	if created:
		Token.objects.create(user=instance)

class User(AbstractBaseUser, PermissionsMixin):

	# O username será o próprio CPF para estep projeto
	username = models.CharField(
		'CPF', max_length=30, unique=True, validators=[
			validators.RegexValidator(
				re.compile('^[\w.@+-]+$'),
				'Informe um cpf válido. '
				# 'Este valor deve conter apenas letras, números '
				# 'e os caracteres: @/./+/-/_ .'
				, 'invalid'
			)
		], help_text='Seu CPF (apenas números)'
	)
	
	name = models.CharField('Nome', max_length=100, blank=True, unique=False)
	email = models.EmailField('E-mail', unique=True)
	telefone = models.CharField('Telefone', max_length=17,unique=False)
	is_staff = models.BooleanField('Equipe', default=False) #boolean
	is_active = models.BooleanField('Ativo', default=True) #boolean
	is_diretor = models.BooleanField('Conta de diretor', default=False) #boolean
	is_secretario = models.BooleanField('Conta de secretário', default=False)
	is_auditor = models.BooleanField('Conta de auditor', default=False)
	date_joined = models.DateTimeField('Data de Entrada', auto_now_add=True)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email'] #Campo requerido na criação de super Usuários

	objects = UserManager()

	class Meta:
		verbose_name = 'Conta'
		verbose_name_plural = 'Todas as contas'

	def __str__(self):
		return self.name

	def get_full_name(self):
		return str(self)

	def get_short_name(self):
		return str(self).split(" ")[0]


class UserDiretor(models.Model):

	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

	class Meta:
		verbose_name = 'Diretor'
		verbose_name_plural = 'Diretores'

	def __str__(self):
		return self.user.name


class UserSecretaria(models.Model):

	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
	tipo = models.CharField('Estadual ou Municipal', max_length=25)
	cidade = models.CharField('Cidade', max_length=50)
	estado = models.CharField('Estado', max_length=60)
	is_valid = models.BooleanField('Conta válida', default=True)

	class Meta:
		verbose_name = 'Secretaria da educação'
		verbose_name_plural = 'Secretarias da educação'

	def __str__(self):
		return self.user.name



class UserAuditor(models.Model):

	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
	is_auditor_despesa = models.BooleanField('Auditor de despesas', default=False) #boolean
	is_auditor_receita = models.BooleanField('Auditor de receitas', default=False) #boolean
	is_auditor_certidao = models.BooleanField('Auditor de certidões', default=False) #boolean
	secretaria = models.ForeignKey(UserSecretaria, on_delete=models.CASCADE, null=True, related_name="UserSecretaria", verbose_name="Usuário da secretaria")

	class Meta:
		verbose_name = 'Auditor'
		verbose_name_plural = 'Auditores'

	def __str__(self):
		return self.user.name


class UserDesenvolvedor(models.Model):

	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

	class Meta:
		verbose_name = 'Desenvolvedor'
		verbose_name_plural = 'Desenvolvedores'

	def __str__(self):
		return self.user.name


class UserMaster(models.Model):

	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

	class Meta:
		verbose_name = 'Master'
		verbose_name_plural = 'Masters'

	def __str__(self):
		return self.user.name
