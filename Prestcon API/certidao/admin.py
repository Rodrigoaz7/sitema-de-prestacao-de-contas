from django.contrib import admin
from .models import Certidao

class CertidaoAdmin(admin.ModelAdmin):
	list_display = ['pk', 'name','tipo', 'inicio_validade', 'final_validade', 'certidao_fornecedor', 
	'codigo_unico','file', 'is_auditada']
	search_fields = ['inicio_validade', 'final_validade']
	list_filter = ['name']

admin.site.register(Certidao, CertidaoAdmin)