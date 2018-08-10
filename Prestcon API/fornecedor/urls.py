from django.conf.urls import url
from fornecedor import views

urlpatterns = [
    url(regex=r'^$', view=views.FornecedorList.as_view(), name='Fornecedor_list'),
    url(regex=r'^filter$', view=views.FornecedorList.as_view(), name='Fornecedor_list'),
    url(regex=r'^criar/$', view=views.FornecedorPost.as_view(), name='Fornecedor_post'),
    # url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.VigenciaDeleteView.as_view(), name='vigencia_delete'),
]