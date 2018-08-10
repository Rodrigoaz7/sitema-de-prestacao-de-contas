from django.contrib import admin

from .models import Cheque, BlocoCheques
from django.core import urlresolvers

class ChequeAdmin(admin.ModelAdmin):

	list_display = ['number','status', 'blococheque','created']

	search_fields = ['status']
	list_filter = ['created']

class BlocoChequeAdmin(admin.ModelAdmin):

	list_display = ['pk', 'director','account','initial_numbers', 'last_numbers']
	search_fields = ['initial_numbers']


admin.site.register(BlocoCheques, BlocoChequeAdmin)
admin.site.register(Cheque, ChequeAdmin)