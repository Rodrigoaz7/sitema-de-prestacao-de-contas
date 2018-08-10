"""prestcon URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.views import login, logout
from rest_framework.authtoken import views
from django.conf import settings
from rest_framework_expiring_authtoken import views as expired_tokens
from django.conf.urls.static import static
from relatorios import relatorios

urlpatterns = [
    #url(r'^api-token-auth/', views.obtain_auth_token),
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^escola/', include('school.urls')),
    url(r'^diretor/', include('accounts.urls')),
    url(r'^users/', include('accounts.urls')),
    url(r'^conta/', include('bank.urls')),
    url(r'^despesa/', include('despesas.urls')),
    url(r'^bloco-cheques/', include('cheque.urls')),
    url(r'^vigencia/', include('vigencia.urls')),
    url(r'^fornecedor/', include('fornecedor.urls')),
    url(r'^certidao/', include('certidao.urls')),
    #url(r'^gerar_relatorio/$', view=relatorios.GenerateRelatorio.as_view(), name='generate_relatorio'),
    url(r'^api-token-expired-auth/', expired_tokens.obtain_expiring_auth_token)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
