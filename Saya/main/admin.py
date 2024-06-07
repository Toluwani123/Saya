from django.contrib import admin
from .models import *


# Register your models here.

admin.site.register(BasicUser)
admin.site.register(Shoe)
admin.site.register(Tender)
admin.site.register(Offer)

admin.site.register(Seller)

admin.site.register(Buyer)
