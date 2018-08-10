from django.conf.urls import url
#from rest_framework import routers
from school import views

urlpatterns = [
    url(regex=r'^$', view=views.SchoolList.as_view(), name='school_list'),
    url(regex=r'^filter$', view=views.SchoolFilter.as_view(), name='school_filter'),
    url(regex=r'^(?P<pk>[0-9]+)/$', view=views.SchoolUpdateView.as_view(), name='School_detail1'),
    url(regex=r'^atualizar/(?P<pk>[0-9]+)/$', view=views.SchoolUpdateView.as_view(), name='School_detail'),
    url(regex=r'^criar/$', view=views.SchoolPost.as_view(), name='School_post'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.SchoolDeleteView.as_view(), name='School_delete'),
]
