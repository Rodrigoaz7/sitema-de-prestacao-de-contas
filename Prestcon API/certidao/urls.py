from django.conf.urls import url
from certidao import views

urlpatterns = [
    url(regex=r'^$', view=views.CertidaoList.as_view(), name='Certidao_list'),
    url(regex=r'^auditadas/$', view=views.CertidoesAuditadasList.as_view(), name='Certidao_validada'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.CertidaoView.as_view(), name='certidao_detail'),
    url(regex=r'^auditar/(?P<pk>[0-9]+)/$', view=views.ValidarCertidao.as_view(), name='certidao_validar'),
]