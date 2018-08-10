from django.conf.urls import url

from cheque import views

urlpatterns = [
    url(regex=r'^$', view=views.ChequeList.as_view(), name='Blococheque_list'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.ChequeUpdateView.as_view(), name='BlocoCheque_detail'),
    url(regex=r'^(?P<pk>[0-9]+)/$', view=views.ListChequesView.as_view(), name='cheque'),
    url(regex=r'^criar/$', view=views.ChequePost.as_view(), name='Cheque_post'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.ChequeDeleteView.as_view(), name='Cheque_delete'),
]