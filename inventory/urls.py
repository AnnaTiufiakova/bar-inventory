from django.urls import path, include
from . import views

urlpatterns = [
    #HTML views
    path("", views.item_list, name="item_list"),
    path("item/create", views.item_create, name="item_create"),
    path("item/<int:pk>/update", views.item_update, name="item_update"),
    path("item/<int:pk>/delete", views.item_delete, name="item_delete"),
    #API endpoints
    path("api/", include("inventory.api_urls"))
    
]
