from django.conf.urls import url
from rest_framework import routers
from accounts import views
from school.views import UserAndSchoolRegister


urlpatterns = [
    url(regex=r'^$', view=views.UserList.as_view(), name='user_list'),
    url(regex=r'^criar/$', view=UserAndSchoolRegister.as_view(), name='register_list'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.UserUpdateView.as_view(), name='User_detail'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.UserDeleteView.as_view(), name='User_delete'),
    url(regex=r'^secretaria/criar/$', view=views.UserSecretariaView.as_view(), name='Secretaria_post'),
    url(regex=r'^secretaria/atualizar/(?P<pk>[0-9]+)/$', view=views.UserSecretariaView.as_view(), name='Secretaria_detail'),
    url(regex=r'^auditor/criar/$', view=views.UserAuditorView.as_view(), name='auditor_post'),
    url(regex=r'^auditor/atualizar/(?P<pk>[0-9]+)/$', view=views.UserAuditorView.as_view(), name='auditor_detail'),
    url(regex=r'^test-token/$', view=views.TestTokenView.as_view(), name='test_token_detail'),
    url(regex=r'^recuperar-senha/$', view=views.RecoveryPasswordView.as_view(), name='recovery_detail'),
    #url(regex=r'^gerar_relatorio/$', view=relatorios.GenerateRelatorio.as_view(), name='register_list'),
]