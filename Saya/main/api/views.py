from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from rest_framework import generics, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from main.models import *
from rest_framework.permissions import IsAuthenticated

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        return token
        # ...

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)

@api_view(['POST'])
def user_registration(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errors during serialization:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateSeller(generics.CreateAPIView):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class CreateBasicUser(generics.CreateAPIView):
    queryset = BasicUser.objects.all()
    serializer_class = BasicUserSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class CreateBuyer(generics.CreateAPIView):
    queryset = Buyer.objects.all()
    serializer_class = BuyerSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class CreateBilling(generics.CreateAPIView):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)



class EditBasicUser(generics.RetrieveUpdateDestroyAPIView):
    queryset = BasicUser.objects.all()
    serializer_class = UpdateBasicUserSerializer
    lookup_field = 'user_id'  # Adjusting to use the User's ID as the lookup field
    permission_classes = [IsAuthenticated]


class EditBuyer(generics.RetrieveUpdateDestroyAPIView):
    queryset = Buyer.objects.all()
    serializer_class = UpdateBuyerSerializer
    lookup_field = 'user_id'  # Adjusting to use the User's ID as the lookup field
    permission_classes = [IsAuthenticated]

class EditSeller(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seller.objects.all()
    serializer_class = UpdateSellerSerializer
    lookup_field = 'user_id'  # Adjusting to use the User's ID as the lookup field
    permission_classes = [IsAuthenticated]


class CreateShoe(generics.CreateAPIView):
    queryset = Shoe.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ShoeSerializer

    def perform_create(self, serializer):
        user = self.request.user

        try:
            seller = Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            seller = Seller.objects.first()

        serializer.save(owner=seller)


    
class FetchShoes(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]





class FetchTenders(APIView):
    def post(self, request, format=None):
        user = self.request.user
        shoe_name = request.data.get('name')
        shoe_brand = request.data.get('brand')
        shoe_colorway = request.data.get('colorway')

        # Debugging prints
        print(f"Received data - Name: {shoe_name}, Brand: {shoe_brand}, Colorway: {shoe_colorway}")

        if shoe_name and shoe_brand:
            shoes = Shoe.objects.filter(name=shoe_name, brand=shoe_brand, colorway=shoe_colorway)
            
            if not shoes.exists():
                return Response({
                    'error': 'Shoe not found.'
                }, status=status.HTTP_404_NOT_FOUND)

            serialized_shoes = ShoeSerializer(shoes, many=True)

            tenders = Tender.objects.filter(shoe__name=shoe_name, shoe__brand=shoe_brand, shoe__colorway=shoe_colorway)
            lowest_for_size = {
                'new': {},
                'used': {}
            }

            for tender in tenders:
                if not tender.accepted:
                    size = tender.shoe.size
                    if tender.shoe.used:
                        if size in lowest_for_size['used']:
                            if tender.price > lowest_for_size['used'][size][1]:
                                lowest_for_size['used'][size] = [tender.shoe.id, tender.price, tender.shoe.name]
                        else:
                            lowest_for_size['used'][size] = [tender.shoe.id, tender.price, tender.shoe.name]
                    else:
                        if size in lowest_for_size['new']:
                            if tender.price > lowest_for_size['new'][size][1]:
                                lowest_for_size['new'][size] = [tender.shoe.id, tender.price, tender.shoe.name]
                        else:
                            lowest_for_size['new'][size] = [tender.shoe.id, tender.price, tender.shoe.name]

            # Print the lowest prices for debugging
            print(f"Lowest prices for sizes (new): {lowest_for_size['new']}")
            print(f"Lowest prices for sizes (used): {lowest_for_size['used']}")

            return Response({
                'info': serialized_shoes.data,
                'tenders_for_size': lowest_for_size
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Shoe name and brand must be provided.'
            }, status=status.HTTP_400_BAD_REQUEST)
class AcceptOffer(APIView):
    def post(self, request, format=None):
        try:
            shoe_id = request.data.get('id')
            tender_id = request.data.get('tender_id')
            shoe = Shoe.objects.get(id=shoe_id)
            tender = Tender.objects.get(id=tender_id)
            offer = Offer.objects.get(shoe=shoe)
            offer.accepted = True
            offer.accepted_tender = tender
            tender.accepted = True
            tender.accepted_offer = offer
            offer.save()
            tender.save()
            return Response({'message': 'Offer accepted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class AcceptTender(APIView):
    def post(self, request, format=None):
        try:
            shoe_id = request.data.get('id')
            offer_id = request.data.get('offer_id')
            shoe = Shoe.objects.get(id=shoe_id)
            offer = Offer.objects.get(id=offer_id)
            tender = Tender.objects.get(shoe=shoe)
            offer.accepted = True
            offer.accepted_tender = tender
            tender.accepted = True
            tender.accepted_offer = offer
            offer.save()
            tender.save()
            return Response({'message': 'Tender accepted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class FetchOffers(APIView):
    def post(self, request, format=None):
        user = self.request.user
        shoe_name = request.data.get('name')
        shoe_brand = request.data.get('brand')
        shoe_colorway = request.data.get('colorway')

        # Debugging prints
        print(f"Received data - Name: {shoe_name}, Brand: {shoe_brand}, Colorway: {shoe_colorway}")

        if shoe_name and shoe_brand:
            shoes = Shoe.objects.filter(name=shoe_name, brand=shoe_brand, colorway=shoe_colorway)
            
            if not shoes.exists():
                return Response({
                    'error': 'Shoe not found.'
                }, status=status.HTTP_404_NOT_FOUND)

            serialized_shoes = ShoeSerializer(shoes, many=True)

            offers = Offer.objects.filter(shoe__name=shoe_name, shoe__brand=shoe_brand, shoe__colorway=shoe_colorway)
            highest_for_size = {}
            new_offers = {}
            used_offers = {}

            for offer in offers:
                if not offer.accepted:
                    size = offer.shoe.size
                    if offer.shoe.used:
                        if size in used_offers:
                            if offer.price > used_offers[size][1]:
                                used_offers[size] = [offer.shoe.id, offer.price]
                        else:
                            used_offers[size] = [offer.shoe.id, offer.price]
                    else:
                        if size in new_offers:
                            if offer.price > new_offers[size][1]:
                                new_offers[size] = [offer.shoe.id, offer.price]
                        else:
                            new_offers[size] = [offer.shoe.id, offer.price]

            highest_for_size = {
                'new': new_offers,
                'used': used_offers
            }

            # Print the highest prices for debugging
            print(f"Highest prices for sizes (new): {new_offers}")
            print(f"Highest prices for sizes (used): {used_offers}")

            return Response({
                'info': serialized_shoes.data,
                'offers_for_size': highest_for_size
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Shoe name and brand must be provided.'
            }, status=status.HTTP_400_BAD_REQUEST)


class FetchShoes_Name(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        shoe_name = request.data.get('shoe_name')

        if shoe_name:
            shoes = Shoe.objects.filter(name=shoe_name)
            if not shoes.exists():
                return Response({
                    'error': 'Shoe not found.'
                }, status=status.HTTP_404_NOT_FOUND)

            serialized_shoes = ShoeSerializer(shoes, many=True)

            tenders = Tender.objects.filter(shoe__in=shoes)  # Fetch tenders related to the shoes
            serialized_tenders = TenderSerializer(tenders, many=True)

            return Response({
                'info': serialized_shoes.data,
                'tenders': serialized_tenders.data  # Use .data to serialize the tenders
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'No shoe name provided.'
            }, status=status.HTTP_400_BAD_REQUEST)




class FetchOffer(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        shoes_info = {}
        
        # Get shoe data from request payload
        shoe_data = request.data.get('shoe', {})

        # Iterate through the shoe data
        for brand, names in shoe_data.items():
            for name in names:
                # Query for the shoes with the given name and brand
                shoes = Shoe.objects.filter(name=name, brand=brand)
                
                if shoes.exists():
                    for shoe in shoes:
                        # Get the owner of the shoe
                        owner = shoe.owner.user.username if shoe.owner else None

                        # Query tenders for the shoe
                        tenders = Tender.objects.filter(shoe=shoe)
                        if tenders.exists():
                            for tender in tenders:
                                if tender.shoe.used == True and tender.accepted==False:
                                    # Check if the shoe name already exists in the dictionary
                                    if shoe.name not in shoes_info:
                                        shoes_info[shoe.name] = {
                                            'color_way': shoe.colorway,
                                            'brand': brand,
                                            'name': name,
                                            'year_made': shoe.year_made,
                                            'shoe_vals': {},
                                            'back_picture': shoe.back_picture.url if shoe.back_picture else None
                                        }
                                    
                                    # Add tender details to the dictionary
                                    for tender in tenders:
                                        if tender.size not in shoes_info[shoe.name]['shoe_vals']:
                                            shoe_owner = tender.shoe.owner.user.username
                                            shoes_info[shoe.name]['shoe_vals'][tender.size] = [(shoe_owner, tender.price, tender.shoe.id, tender.shoe.name)]
                                        else:
                                            shoe_owner = tender.shoe.owner.user.username
                                            shoes_info[shoe.name]['shoe_vals'][tender.size].append((shoe_owner, tender.price, tender.shoe.id, tender.shoe.name))

                                else:
                                    # Ignore tenders with tender.used as False
                                    pass
                else:
                    # Handle case when no shoe is found
                    pass

        return Response({'info': list(shoes_info.values())})

class CreateTender(generics.CreateAPIView):
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        shoe_id = self.request.data.get('shoe')
        print("Shoe ID:", shoe_id)  # Print out the shoe_id value
        try:
            shoe = Shoe.objects.get(id=shoe_id)
            seller = Seller.objects.get(user=user)
            serializer.save(owner=seller, shoe=shoe)
        except Shoe.DoesNotExist:
            print("Shoe matching query does not exist.")
            # Handle the case where the Shoe object is not found


class CreateQualityControl(generics.CreateAPIView):
    queryset = Quality_Control.objects.all()
    serializer_class = QualityControlSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        shoe_id = self.request.data.get('shoe')
        print("Shoe ID:", shoe_id)  # Print out the shoe_id value
        try:
            shoe = Shoe.objects.get(id=shoe_id)
            serializer.save(shoe=shoe)
        except Shoe.DoesNotExist:
            print("Shoe matching query does not exist.")
            # Handle the case where the Shoe object is not found



class CreateOffer(generics.CreateAPIView):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        shoe_id = self.request.data.get('shoe')
        author = self.request.data.get('owner')
        size = self.request.data.get('size')
         # Ensure the price is included in the request data

        try:
            shoe = Shoe.objects.get(id=shoe_id)
            basicuser = User.objects.get(id=author)
            buyer = Buyer.objects.get(user=basicuser)
            new_offer = serializer.save(owner=buyer, shoe=shoe, size=size)

            shoes = Shoe.objects.filter(name=shoe.name, size=shoe.size, brand=shoe.brand, colorway=shoe.colorway)
            
            for item in shoes:
                if not item.used:
                    tenders = Tender.objects.filter(shoe__name=item.name, shoe__size=item.size, accepted=False)
                    for tender in tenders:
                        tender_owner = tender.owner.user
                        notification_message = f"You have a new offer of ${new_offer.price} for your tender on shoe {shoe.name} size {size}"
                        send_notification(tender_owner, notification_message)

        except Shoe.DoesNotExist:
            print("Shoe matching query does not exist.")

def send_notification(user, message):
    print(f"Sending notification to {user.username}: {message}")
    # Example of sending an email notification

