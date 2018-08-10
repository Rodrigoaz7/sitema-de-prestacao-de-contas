from django.contrib import admin

from .models import Bank_account
from django.core import urlresolvers

class BankAdmin(admin.ModelAdmin):

	list_display = ['bank', 'bank_code','agencia', 'digito_agencia', 'account_number', 'digito_account_number',
	 'code','name', 'link_to_director','vigencia','created']

	def link_to_director(self, obj):
		link=urlresolvers.reverse("admin:accounts_user_change", args=[obj.director.id]) #model name has to be lowercase
		return u'<a href="%s">%s</a>' % (link,obj.director.name)
	
	link_to_director.allow_tags=True
	
	search_fields = ['bank', 'name', 'agencia']
	list_filter = ['created']
	#prepopulated_fields = {'slug': ('name',), }

admin.site.register(Bank_account, BankAdmin)
