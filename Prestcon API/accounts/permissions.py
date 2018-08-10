from school.models import School
from accounts.models import *
from fornecedor.models import Fornecedor
from despesas.models import Despesa
from certidao.models import Certidao


# Funcao para retornar a queryset certa de listagem de escolas para cada tipo de usuario
def Querysets_schools(self, request):
	if request.method == "GET":
		if request.user.is_superuser or request.user.is_staff:
			return School.objects.all()
		elif request.user.is_diretor:
			return School.objects.filter(director=request.user)
		elif request.user.is_secretario or request.user.is_auditor:
			if request.user.is_auditor:
				user = UserAuditor.objects.get(user=request.user).secretaria
			else:
				user = UserSecretaria.objects.get(user=request.user)
			if user.tipo == "estadual":
				return School.objects.filter(classification_school=user.tipo, state=user.estado)
			elif user.tipo == "municipal":
				return School.objects.filter(classification_school=user.tipo, state=user.estado, city=user.cidade)
		return null


#Função para retornar querysets dos fornecedores para cada tipo de usuario
def Querysets_fornecedores(self, request):
	if request.method == "GET":
		if request.user.is_superuser or request.user.is_staff:
			return Fornecedor.objects.all()
		if not request.GET:
			print("OI")
			return Fornecedor.objects.filter(vigencia__director=request.user)
		else:
			if request.GET.get('school'):
				escola = School.objects.get(pk=request.GET['school'])
				if escola.classification_school == "estadual":
					return Fornecedor.objects.filter(school__classification_school="estadual", school__state=escola.state)
				elif escola.classification_school == "municipal":
					return Fornecedor.objects.filter(school__classification_school="estadual", school__state=escola.state, school__city=escola.city)

			if request.GET.get('search'):
				if Fornecedor.objects.filter(name__contains=request.GET['search']).count() > 0:
					return Fornecedor.objects.filter(name__contains=request.GET['search'])
				else:
					return Fornecedor.objects.filter(cnpj__contains=request.GET['search'])
		return Fornecedor.objects.filter(vigencia__director=request.user)


# Funcao para retornar a queryset certa de listagem de escolas para cada tipo de usuario
def Querysets_despesas(self, request):
	if request.method == "GET":
		if not request.GET:
			if request.user.is_superuser or request.user.is_staff:
				return Despesa.objects.all()
			elif request.user.is_diretor:
				return Despesa.objects.filter(vigencia__director=request.user).order_by('-created')
			elif request.user.is_secretario or request.user.is_auditor:
				if request.user.is_auditor:
					user = UserAuditor.objects.get(user=request.user).secretaria
				else:
					user = UserSecretaria.objects.get(user=request.user)
				if user.tipo == "estadual":
					return Despesa.objects.filter(school__classification_school=user.tipo, school__state=user.estado)
				elif user.tipo == "municipal":
					return School.objects.filter(school__classification_school=user.tipo, school__state=user.estado, school__city=user.cidade)
		return null


#Função para retornar querysets das certidoes dos fornecedores para cada tipo de usuario
def Querysets_certidoes(self, request):
	if request.method == "GET":
		if request.user.is_superuser or request.user.is_staff:
			return Certidao.objects.all()
		if not request.GET:
			return Certidao.objects.filter(certidao_fornecedor__vigencia__director=request.user)
		else:
			if request.GET.get('school'):
				escola = School.objects.get(pk=request.GET['school'])
				if escola.classification_school == "estadual":
					return Certidao.objects.filter(certidao_fornecedor__school__classification_school="estadual", school__state=escola.state)
				elif escola.classification_school == "municipal":
					return Certidao.objects.filter(certidao_fornecedor__school__classification_school="estadual", school__state=escola.state, school__city=escola.city)
		return null