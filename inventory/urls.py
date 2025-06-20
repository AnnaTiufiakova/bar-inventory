from django.urls import path, include
from . import views

urlpatterns = [
    #API endpoints
    path("api/", include("inventory.api_urls"))
    
]
