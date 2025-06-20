from rest_framework import serializers
from .models import Category, Item, Recipe, RecipeIngredient

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  
    class Meta:
        model = Item
        fields = "__all__"
class RecipeIngredientSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), source="item", write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = ["id", "item", "item_id", "quantity", "unit"]

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ["id", "name", "ingredients"]

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients")
        recipe = Recipe.objects.create(**validated_data)
        for ing in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **ing)
        return recipe