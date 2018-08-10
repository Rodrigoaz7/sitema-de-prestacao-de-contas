from django.conf.urls import url

from bank import views

urlpatterns = [
    url(regex=r'^$', view=views.BankList.as_view(), name='Bank_list'),
    url(regex=r'^filter$', view=views.BankFilter.as_view(), name='Bank_list'),
    url(regex=r'^(?P<pk>[0-9]+)/$', view=views.BankUpdateView.as_view(), name='Bank_detail1'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.BankUpdateView.as_view(), name='Bank_detail'),
    url(regex=r'^criar/$', view=views.BankPost.as_view(), name='Bank_post'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.BankDeleteView.as_view(), name='Bank_delete'),
]
