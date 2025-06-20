from django.shortcuts import render, redirect, get_object_or_404
from .models import Item, Category, Recipe
from .forms import ItemForm
from rest_framework import viewsets
from rest_framework import generics
from .serializers import CategorySerializer, ItemSerializer, RecipeSerializer


def item_list(request):
    items = Item.objects.all()
    return render(request, "inventory/item_list.html", {"items": items})


def item_create(request):
    if request.method == "POST":
        form = ItemForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("item_list")
    else:
        form = ItemForm()
    return render(request, "inventory/item_form.html", {"form": form})


def item_update(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == "POST":
        form = ItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            return redirect("item_list")
    else:
        form = ItemForm(instance=item)
    return render(request, "inventory/item_form.html", {"form": form})


def item_delete(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == "POST":
        item.delete()
        return redirect("item_list")
    return render(request, "inventory/item_confirm_delete.html", {"item": item})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
