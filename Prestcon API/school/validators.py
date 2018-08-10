from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
import re

def ValidarCPF(valor):

	# if User.objects.filter(username=valor).exists():
	# 	print("primeiro if")
	# 	return False

	valor = valor.replace('.', '')
	valor = valor.replace('-', '')

	if not valor.isdigit() or len(valor) != 11:
		print("segundo if")
		return False

	cpf_valido = valor[0:9]
	base = 10
   
	while len(cpf_valido) < 11:
   
		soma = 0
	   
		for n in cpf_valido:
			soma += int(n) * base
			base -= 1
	   
		digito = soma % 11
	   
		if digito < 2:
			digito = 0
		else:
			digito = 11 - digito
		   
		cpf_valido += str(digito)

		base = 11

	if cpf_valido == valor:
		return True
	else:
		return False


def ValidarClassificacaoEscola(data):
	data = data.lower()
	if data == "municipal" or data == "estadual":
		return True
	else:
		return False

def ValidarTipoEscola(data):
	data = data.lower()
	if str(data) not in "escola/creche/pré-escola":
		return False
	else:
		return True

def ValidarSenha(data):
	if len(data) < 6:
		return False
	elif not re.search("[a-z]", data) and not re.search("[A-Z]", data):
		return False
	elif not any(i.isdigit() for i in data):
		return False
	else:
		return True