from django.db import models
from accounts.models import User


class Room(models.Model):
	DE = 'despesas'
	RE = 'receitas'
	DM = 'dimensionamentos'
	auditoria_type_choice = (
		(DE, 'despesas'),
		(RE, 'receitas'),
		(DM, 'dimensionamentos'),
	)

	tipo_auditoria = models.CharField("Chat da auditoria", max_length=15, choices=auditoria_type_choice, default=DM)
	data_criacao = models.DateTimeField('Hora e data de criação da sala', auto_now_add=True)

	class Meta:
		verbose_name = "Sala"
		verbose_name_plural = "Salas"


class Message(models.Model):

	sender = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Destinatário", null=True, related_name="sender")
	reciever = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Destino", null=True, related_name="reciever")
	msg = models.TextField("Mensagem")
	file_msg = models.FileField("Arquivo em mensagem", null=True, blank=True)
	from_room = models.ForeignKey(Room, on_delete=models.CASCADE, verbose_name="Sala", null=True, related_name="room_message")
	visualizada = models.BooleanField("Mensagem visualizada", default=False)
	data_envio = models.DateTimeField('Hora e data de envio', auto_now_add=True)

	class Meta:
		verbose_name = "Mensagem"
		verbose_name_plural = "Mensagens"



