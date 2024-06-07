from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator

BRANDS = (
    ("A Bathing Ape", "A Bathing Ape"),
    ("Nike", "Nike"),
    ("Adidas", "Adidas"),
    ("Jordan", "Jordan"),
    ("New Balance", "New Balance"),
    ("Converse", "Converse"),
    ("Balmain", "Balmain"),
    ("Cactus Flea Plant Market", "Cactus Flea Plant Market"),
    ("Maison Mihara", "Maison Mihara"),
    ("Rick Owens", "Rick Owens"),
    ("Comme des Garcons", "Comme des Garcons"),
    ("Birkenstock", "Birkenstock")
)

QUALITY = (
    ("Slightly Used W/ Original Box New", "Slightly Used W/ Original Box New"),
    ("Heavily Used W/ Original Box New", "Heavily Used W/ Original Box New"),
    ("Slightly Used W/ Original Box Damaged", "Slightly Used W/ Original Box Damaged"),
    ("Heavily Used W/ Original Box Damaged", "Heavily Used W/ Original Box Damaged"),
    ("Slightly Used No Box", "Slightly Used No Box"),
    ("Heavily Used No Box", "Heavily Used No Box"),
)

class BasicUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    selling = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    return_address = models.CharField(max_length=20000)

class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    shipping_address = models.CharField(max_length=20000)

class Billing(models.Model):
    owner = models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=16)
    cvc = models.PositiveIntegerField()  # Removed max_length
    expiry_date = models.DateField()
    full_name = models.CharField(max_length=40)
    zip_code = models.PositiveIntegerField()  # Removed max_length

class Shoe(models.Model):
    current_year = timezone.now().year

    owner = models.ForeignKey(Seller, on_delete=models.CASCADE, null=True, blank=True)
    brand = models.CharField(
        max_length=200,
        choices=BRANDS,
        null=False,
        blank=False
    )
    colorway = models.CharField(max_length=160, null=True, blank=True)
    size = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    year_made = models.IntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(current_year)],
        help_text="Enter the year the shoe was made.",
        null=True, blank=True
    )
    used = models.BooleanField(default=False)
    front_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    leftside_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    rightside_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    back_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    top_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    sole_picture = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    flaw_picture_1 = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    flaw_picture_2 = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")
    flaw_picture_3 = models.ImageField(null=True, blank=True, upload_to="creator-pictures/")

    
    def __str__(self):
        return self.name

class Quality_Control(models.Model):
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    quality = models.CharField(
        max_length=200,
        choices=QUALITY,
        null=False,
        blank=False
    )

class Tender(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    size = models.CharField(max_length=200)
    owner = models.ForeignKey(Seller, on_delete=models.CASCADE, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Add the price field
    accepted = models.BooleanField(default=False)
    accepted_offer = models.ForeignKey('Offer', on_delete=models.CASCADE, null=True, blank=True)

    @classmethod
    def highest_price(cls):
        return cls.objects.order_by('-price').first()

    @classmethod
    def lowest_price(cls):
        return cls.objects.order_by('price').first()

class Offer(models.Model):
    EXPIRATION_CHOICES = [
        (1, '1 day'),
        (5, '5 days'),
        (7, '7 days'),
        (10, '10 days'),
        (15, '15 days'),
        (30, '30 days'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, null=True, blank=True)
    size = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    owner = models.ForeignKey(Buyer, on_delete=models.CASCADE)
    expiration_duration = models.IntegerField(choices=EXPIRATION_CHOICES, default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)
    accepted_tender = models.ForeignKey(Tender, on_delete=models.CASCADE, null=True, blank=True)
    
    @property
    def expiration_time(self):
        return self.created_at + timedelta(days=self.expiration_duration)

    @classmethod
    def highest_price(cls):
        return cls.objects.order_by('-price').first()

    @classmethod
    def lowest_price(cls):
        return cls.objects.order_by('price').first()
    

class Favorites(models.Model):
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, null=False, blank=False)
    user = models.ForeignKey(BasicUser, on_delete=models.CASCADE, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)



