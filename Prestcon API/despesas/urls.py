from django.conf.urls import url

from . import views

urlpatterns = [
    url(regex=r'^$', view=views.DespesaList.as_view(), name='Despesas_list'),
    url(regex=r'^filter$', view=views.DespesaFilter.as_view(), name='Despesas_list'),
    url(regex=r'^criar/$', view=views.DespesaPost.as_view(), name='Despesas_post'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.DespesaUpdateView.as_view(), name='Despesa_detail'),
    url(regex=r'^auditar/(?P<pk>[0-9]+)/$', view=views.AuditarDespesa.as_view(), name='Despesa_auditar'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.DespesaDeleteView.as_view(), name='Despesa_delete'),
    url(regex=r'^nfe/$', view=views.NFeList.as_view(), name='NFe_detail'),
    url(regex=r'^nfeio/$', view=views.consultar_nfe_io.as_view(), name='NFe_io'),
    url(regex=r'^nfmanual/$', view=views.NFManualList.as_view(), name='NFManual_detail'),
    url(regex=r'^recibo/$', view=views.ReciboList.as_view(), name='Recibo_list'),
    url(regex=r'^fatura/$', view=views.FaturaList.as_view(), name='Fatura_list'),
    url(regex=r'^produtofat/(?P<pk>[0-9]+)/$', view=views.ProdutoFaturaList.as_view(), name='produtofat_list'),
    url(regex=r'^produtorec/(?P<pk>[0-9]+)/$', view=views.ProdutoReciboList.as_view(), name='produtorec_list'),
    url(regex=r'^produtonf/(?P<pk>[0-9]+)/$', view=views.ProdutoNotaFiscalList.as_view(), name='produtonf_list'),
    url(regex=r'^produtonfelet/(?P<pk>[0-9]+)/$', view=views.ProdutoNotaFiscalEletList.as_view(), name='produtonfelet_Delete'),
    url(regex=r'^produtofat/deletar/(?P<pk>[0-9]+)/$', view=views.ProdutoFaturaDelete.as_view(), name='produtofat_Delete'),
    url(regex=r'^produtorec/deletar/(?P<pk>[0-9]+)/$', view=views.ProdutoReciboDelete.as_view(), name='produtorec_Delete'),
    url(regex=r'^produtonf/deletar/(?P<pk>[0-9]+)/$', view=views.ProdutoNotaFiscalDelete.as_view(), name='produtonf_Delete'),
    url(regex=r'^produtonfelet/deletar/(?P<pk>[0-9]+)/$', view=views.ProdutoNotaFiscalEletDelete.as_view(), name='produtonfelet_Delete'),
]
