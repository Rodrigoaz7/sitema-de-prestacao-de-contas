# # from easy_pdf.views import PDFTemplateView
# # from easy_pdf import rendering
# from io import BytesIO
# from django.http import HttpResponse
# from django.template.loader import get_template
# from xhtml2pdf import pisa
# from rest_framework import viewsets, generics, permissions
# from rest_framework.response import Response
# from django.http import Http404
# from rest_framework import status
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
# from accounts.permissions import *
# from fornecedor.models import Fornecedor
# from rest_framework.permissions import AllowAny


# class GenerateRelatorio(generics.ListCreateAPIView):

# 	permission_classes = (AllowAny,)

# 	def render_to_pdf(self, template_src):
# 		template = get_template(template_src)
# 		html  = template.render()
# 		result = BytesIO()
# 		pdf = pisa.pisaDocument(BytesIO(html.encode("utf-8")), result)

# 		if not pdf.err:
# 			return HttpResponse(result.getvalue(), content_type='application/pdf')
# 		return None
	

# 	def get(self, request, format=None):

# 		print(request.GET['tipo'])
# 		if request.GET:
# 			if request.GET.get("tipo"):
# 				if request.GET['tipo'] == "pagamentos":
# 					name_of_template = "templates/relatorio_pagamentos.html"
# 				elif request.GET['tipo'] == "relacao_bens":
# 					name_of_template = "templates/relatorio_relacao_bens.html"
# 				elif request.GET['tipo'] == "execucao_fisica":
# 					name_of_template = "templates/relatorio_execucao_fisica.html"
# 				elif request.GET['tipo'] == "receita_despesa":
# 					name_of_template = "templates/relatorio_receita_despesa.html"
# 				else:
# 					return Response("Sem tipo de relatório determinado", status=status.HTTP_400_BAD_REQUEST)
					
# 				#forn = Fornecedor.objects.first()

# 				context = {
# 					"pagesize":"A4 landscape",
# 					"fornecedor":forn[0],
# 					"nome_orgao":"EAIEIAIEIAEIAIEIO",
# 					"uf":"RN",
# 					"num_convenio":"1234",
# 					"tipo":"conta",
# 					"num_processo":"456-89",
# 					"num_parcela":"12",
# 					"exercicio":"Merenda"
# 				}

# 				pdf = rendering.render_to_pdf(name_of_template, context)
# 				if pdf:
# 					response = HttpResponse(pdf, content_type='application/pdf')
# 					filename = "Invoice_%s.pdf" %("12341231")
# 					content = "inline; filename='%s'" %(filename)
# 					download = request.GET.get("download")
# 					if download:
# 						content = "attachment; filename='%s'" %(filename)
# 					response['Content-Disposition'] = content
# 					return response
# 				return HttpResponse("Not found")

# 		return Response('Necessário um tipo de relatório', status=status.HTTP_403_FORBIDDEN)

# 	def post(self, request, format=None):
# 		return Response('Requisição proibida nesta url', status=status.HTTP_403_FORBIDDEN)