from main.models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')

    

    def validate(self, data):
        password = data.get('password')
        


        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class SellerSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Seller
        fields = (
            'user', 
            'return_address'
           
        )

class BuyerSerializer(serializers.ModelSerializer):

   
    class Meta:
        model = Buyer
        fields = (
            'user', 
            'shipping_address'
           
        )

class BasicUserSerializer(serializers.ModelSerializer):
    
   
    class Meta:
        model = BasicUser
        fields = (
            'user', 
            'selling'
           
        )

class BillingSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Buyer
        fields = (
            'user', 
            'shipping_address'
           
        )

class BasicShoeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shoe
        fields = (
            'brand',
            'colorway',
            'size',
            'name',
            'year_made',
            'used',
            'front_picture',
            'rightside_picture',
            'leftside_picture',
            'back_picture',
            'top_picture',
            'sole_picture',
            'flaw_picture_1',
            'flaw_picture_2',
            'flaw_picture_3'
        )

class ShoeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shoe
        fields = (
            'id', 'brand', 'colorway', 'size', 'name', 'year_made', 'used',
            'front_picture', 'rightside_picture', 'leftside_picture', 'back_picture',
            'top_picture', 'sole_picture', 'flaw_picture_1', 'flaw_picture_2', 'flaw_picture_3'
        )

class QualityControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality_Control
        fields = ('shoe', 'quality')



class TenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tender
        fields = ('id', 'shoe', 'size', 'owner', 'price')

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'shoe', 'size', 'owner', 'price', 'expiration_duration', 'created_at')



class UpdateBasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicUser
        fields = ('selling',)

    def validate(self, data):
        print("Validating serializer data:", data)
        # Add your validation logic here if needed
        return data

class UpdateBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = (
            'shipping_address',
           
        )

        def validate(self, data):
            print("Validating serializer data:", data)
            # Add your validation logic here if needed
            return data
    
class UpdateSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = (
            'return_address',
           
        )

        def validate(self, data):
            print("Validating serializer data:", data)
            # Add your validation logic here if needed
            return data
    
