from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserAdminCreationForm, UserAdminForm
from rest_framework.authtoken.admin import TokenAdmin

class DirectorAdmin(BaseUserAdmin):
	add_form = UserAdminCreationForm
	add_fieldsets = (
		(None, {
			'fields': ('username', 'email', 'password1', 'password2')
		}),
	)
	form = UserAdminForm
	fieldsets = (
		(None, {
			'fields': ('username', 'email')
		}),
		('Informações Básicas', {
			'fields': ('name', 'telefone')
		}),
		(
			'Permissões', {
				'fields': (
					'is_active', 'is_staff', 'is_superuser', 'is_diretor', 
					'is_secretario', 'is_auditor', 'groups',
					'user_permissions'
				)
			}
		),
	)
	list_display = ['pk', 'username','name', 'email', 'telefone','is_superuser', 'is_diretor', 
		'is_secretario', 'is_auditor', 'is_staff']
	search_fields = ['name', 'email']
	list_filter = ['username']
	#prepopulated_fields = {'slug': ('name',), }


class Diretor(admin.ModelAdmin):

	list_display = ['user']

class Secretaria(admin.ModelAdmin):

	list_display = ['user', 'tipo', 'cidade', 'estado', 'is_valid']

class Auditoria(admin.ModelAdmin):

	list_display = ['user', 'is_auditor_receita', 'is_auditor_despesa', 'is_auditor_certidao']

class Master(admin.ModelAdmin):

	list_display = ['user']

class Desenvolvedor(admin.ModelAdmin):

	list_display = ['user']

admin.site.register(User, DirectorAdmin)
admin.site.register(UserSecretaria, Secretaria)
admin.site.register(UserAuditor, Auditoria)
admin.site.register(UserDiretor, Diretor)
admin.site.register(UserMaster, Master)
admin.site.register(UserDesenvolvedor, Desenvolvedor)
TokenAdmin.raw_id_fields = ('user',)