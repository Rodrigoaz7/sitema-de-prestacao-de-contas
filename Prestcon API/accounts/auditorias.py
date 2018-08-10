from school.models import School
from accounts.models import *
from fornecedor.models import Fornecedor
from despesas.models import Despesa
from certidao.models import Certidao
from rest_framework import status
from rest_framework.response import Response


def Auditoria_certidoes(self, request, certidao):
	if request.user.is_superuser:
		certidao.is_auditada = True
		certidao.save()
		return Response('Certidão auditada', status=status.HTTP_200_OK)

	elif request.user.is_secretario:
		sec = UserSecretaria.objects.get(user=request.user)
		if sec.tipo == certidao.certidao_fornecedor.school.classification_school:
			if sec.tipo == "estadual" and sec.estado == certidao.certidao_fornecedor.school.state:
				certidao.is_auditada = True
				certidao.save()
				return Response('Certidão auditada', status=status.HTTP_200_OK)
			elif sec.tipo == "municipal" and sec.estado == certidao.certidao_fornecedor.school.state and sec.cidade == certidao.certidao_fornecedor.school.city:
				certidao.is_auditada = True
				certidao.save()
				return Response('Certidão auditada', status=status.HTTP_200_OK)

	elif request.user.is_auditor:
		auditor = UserAuditor.objects.get(user=request.user)
		if auditor.is_auditor_certidao:
			sec = UserSecretaria.objects.get(user=auditor.secretaria.user)
			if sec.tipo == certidao.certidao_fornecedor.school.classification_school:
				if sec.tipo == "estadual" and sec.estado == certidao.certidao_fornecedor.school.state:
					certidao.is_auditada = True
					certidao.save()
					return Response('Certidão auditada', status=status.HTTP_200_OK)
				elif sec.tipo == "municipal" and sec.estado == certidao.certidao_fornecedor.school.state and sec.cidade == certidao.certidao_fornecedor.school.city:
					certidao.is_auditada = True
					certidao.save()
					return Response('Certidão auditada', status=status.HTTP_200_OK)

	return Response("Permissão negada", status=status.HTTP_403_FORBIDDEN)


def Auditoria_despesas(self, request, despesa):
	if request.user.is_superuser:
		despesa.is_auditada = True
		despesa.save()
		return Response('Despesa auditada', status=status.HTTP_200_OK)

	elif request.user.is_secretario:
		sec = UserSecretaria.objects.get(user=request.user)
		if sec.tipo == despesa.fornecedor.school.classification_school:
			if sec.tipo == "estadual" and sec.estado == despesa.fornecedor.school.state:
				despesa.is_auditada = True
				despesa.save()
				return Response('Despesa auditada', status=status.HTTP_200_OK)
			elif sec.tipo == "municipal" and sec.estado == despesa.fornecedor.school.state and sec.cidade == despesa.fornecedor.school.city:
				despesa.is_auditada = True
				despesa.save()
				return Response('Despesa auditada', status=status.HTTP_200_OK)

	elif request.user.is_auditor:
		auditor = UserAuditor.objects.get(user=request.user)
		if auditor.is_auditor_despesa:
			sec = UserSecretaria.objects.get(user=auditor.secretaria.user)
			if sec.tipo == despesa.fornecedor.school.classification_school:
				if sec.tipo == "estadual" and sec.estado == despesa.fornecedor.school.state:
					despesa.is_auditada = True
					despesa.save()
					return Response('Despesa auditada', status=status.HTTP_200_OK)
				elif sec.tipo == "municipal" and sec.estado == despesa.fornecedor.school.state and sec.cidade == despesa.fornecedor.school.city:
					despesa.is_auditada = True
					despesa.save()
					return Response('Despesa auditada', status=status.HTTP_200_OK)

	return Response("Permissão negada", status=status.HTTP_403_FORBIDDEN)