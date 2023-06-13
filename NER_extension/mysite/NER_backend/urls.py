from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^get_NER/$', views.get_NER, name='get_NER')
]