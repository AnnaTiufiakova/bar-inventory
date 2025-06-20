from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ItemViewSet, RecipeListCreateView 

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"items", ItemViewSet, basename="item")
router.register(r"recipes", RecipeListCreateView, basename="recipe")  # <- use ModelViewSet for recipes

urlpatterns = [
    path("", include(router.urls)),
]
