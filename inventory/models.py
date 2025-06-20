from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Category name:")

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=100, verbose_name="Item name:")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, verbose_name="Category:"
    )
    UNIT_CHOICES = [
        ("300 ml", "300 ml"),
        ("750 ml", "750 ml"),
        ("1000 ml", "1000 ml"),
        ("bottle", "bottle"),
        ("units", "units"),
    ]
    units = models.CharField(max_length=20, choices=UNIT_CHOICES, verbose_name="Units:", null=False, blank=False)
    cost_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Cost per unit:",
    )
    empty_bottle = models.FloatField(
        null=True, blank=True, verbose_name="Empty bottle weight:"
    )
    image = models.ImageField(upload_to='item_images/', null=True, blank=True, verbose_name="Upload image")
    date_added = models.DateTimeField(auto_now_add=True, verbose_name="Date added")

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name="ingredients", on_delete=models.CASCADE)
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    UNIT_CHOICES_2 = [
        ("ml", "ml"),
        ("gr", "gr"),
        ("units", "units"),
    ]
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES_2)
    quantity = models.FloatField() #in ml, gr, units

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.item.name} in {self.recipe.name}"