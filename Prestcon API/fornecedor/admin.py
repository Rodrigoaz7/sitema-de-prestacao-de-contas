from django.contrib import admin
from .models import Fornecedor

class FornecedorAdmin(admin.ModelAdmin):
	list_display = ['pk', 'vigencia', 'school', 'name', 'cnpj', 'telefone', 'email', 'endereco']
	search_fields = ['name', 'cnpj']
	list_filter = ['vigencia']

admin.site.register(Fornecedor, FornecedorAdmin)
