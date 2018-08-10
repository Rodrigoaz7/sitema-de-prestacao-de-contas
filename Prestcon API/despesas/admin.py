from django.contrib import admin

from .models import *


class DespesaAdmin(admin.ModelAdmin):

    list_display = ['pk','tipo_despesa', 'school', 'fornecedor', 'bank', 'tipo_documento', 'tipo_nota_fiscal', 
    'num_comprovante_pag', 'data_comprovante_pag', 'file_comprovante','file_proposta1',
    'file_proposta2','file_proposta3','file_tipo_documento', 'file_recibo', 'created',]

    search_fields = ['fornecedor', 'file_tipo_documento', 'tipo_despesa']
    list_filter = ['created']

class ProdutoNfAdmin(admin.ModelAdmin):

    list_display = ['pk','name', 'unidades', 'valor_total','valor_unitario', 'tipo_unidade', 'despesa']
    list_filter = ['despesa']

class ProdutoRecAdmin(admin.ModelAdmin):

    list_display = ['pk','name', 'unidades', 'valor_total','valor_unitario', 'tipo_unidade', 'despesa']
    list_filter = ['despesa']

class ProdutoFatAdmin(admin.ModelAdmin):

    list_display = ['pk','name', 'unidades', 'valor_total','valor_unitario','tipo_unidade', 'despesa']
    list_filter = ['despesa']

class ProdutoNfeletAdmin(admin.ModelAdmin):
    list_display = ['pk','name', 'unidades', 'valor_total','valor_unitario',
    'tipo_unidade', 'cfop', 'o_cst', 'ncm_sh', 'despesa']
    list_filter = ['despesa']


admin.site.register(Despesa, DespesaAdmin)
admin.site.register(ProdutoNf, ProdutoNfAdmin)
admin.site.register(ProdutoFat, ProdutoFatAdmin)
admin.site.register(ProdutoRec, ProdutoRecAdmin)
admin.site.register(ProdutoNfelet, ProdutoNfeletAdmin)

