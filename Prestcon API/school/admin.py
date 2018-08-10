from django.contrib import admin
from .models import School
from django.core import urlresolvers

class SchoolAdmin(admin.ModelAdmin):

	list_display = ['pk','name', 'cnpj', 'type_school', 'link_to_director', 'vigencia', 
	'state', 'city', 'classification_school', 'created']

	def link_to_director(self, obj):
		link=urlresolvers.reverse("admin:accounts_user_change", args=[obj.director.id]) #model name has to be lowercase
		return u'<a href="%s">%s</a>' % (link,obj.director.name)
	
	link_to_director.allow_tags=True

	search_fields = ['name']
	list_filter = ['created']


admin.site.register(School, SchoolAdmin)

