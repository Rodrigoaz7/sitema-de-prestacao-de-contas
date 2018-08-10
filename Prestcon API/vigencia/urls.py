from django.conf.urls import url
from vigencia import views

urlpatterns = [
    url(regex=r'^$', view=views.VigenciaList.as_view(), name='vigencia_list'),
    url(regex=r'^criar/$', view=views.VigenciaPost.as_view(), name='vigencia_post'),
    url(regex=r'^deletar/(?P<pk>[0-9]+)/$', view=views.VigenciaDeleteView.as_view(), name='vigencia_delete'),
]