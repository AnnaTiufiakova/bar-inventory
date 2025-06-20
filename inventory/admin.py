from django.contrib import admin
from .models import Category, Item, Recipe, RecipeIngredient
from django import forms

class ItemAdminForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = "__all__"  # Corrected from "all" to "__all__"

    def __init__(self, *args, **kwargs):  # Corrected from init to __init
        super(ItemAdminForm, self).__init__(*args, **kwargs)

        category_id = self.initial.get("category") or getattr(self.instance, "category_id", None)
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                name = category.name.lower()
                if name == "glassware":
                    self.fields.pop("units", None)
                    self.fields.pop("empty_bottle", None)
                elif name == "beer":
                    self.fields.pop("empty_bottle", None)
                elif name not in ["wine", "liquor"]:
                    self.fields.pop("units", None)
                    self.fields.pop("empty_bottle", None)
            except Category.DoesNotExist:
                pass

class ItemAdmin(admin.ModelAdmin):
    form = ItemAdminForm

admin.site.register(Category)
admin.site.register(Item, ItemAdmin)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)