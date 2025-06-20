from rest_framework import serializers
from .models import Category, Item, Recipe, RecipeIngredient

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = '__all__'

    def update(self, instance, validated_data):
        image = validated_data.get('image', None)
        if image is not None:
            instance.image = image  # allow image overwrite
        else:
            # Don't remove the existing image if a new one wasn't provided
            validated_data.pop('image', None)

        return super().update(instance, validated_data)

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

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])

        # Update recipe name
        instance.name = validated_data.get("name", instance.name)
        instance.save()

        # Clear existing ingredients
        instance.ingredients.all().delete()

        # Add new ingredients
        for ing in ingredients_data:
            RecipeIngredient.objects.create(recipe=instance, **ing)

        return instance