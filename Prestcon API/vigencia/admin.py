from django.contrib import admin
from .models import Vigencia

class VigenciaAdmin(admin.ModelAdmin):
	list_display = ['pk', 'director', 'initial_date','final_date']
	search_fields = ['initial_date', 'final_date']
	list_filter = ['director']

admin.site.register(Vigencia, VigenciaAdmin)
