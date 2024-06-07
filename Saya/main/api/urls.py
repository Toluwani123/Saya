from django.urls import path
from . import views
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import *

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', user_registration, name='user_registration'),
    path('create-seller/', CreateSeller.as_view(), name='create_seller'),
    path('create-buyer/', CreateBuyer.as_view(), name='create_buyer'),
    path('create-basic-user/', CreateBasicUser.as_view(), name='create_buyer'),
    path('basicuser/<int:user_id>/', EditBasicUser.as_view(), name='edit-basic-user'),
    path('buyer/<int:user_id>/', EditBuyer.as_view(), name='edit-buyer'),
    path('seller/<int:user_id>/', EditSeller.as_view(), name='edit-seller'),
    path('create_shoe/', CreateShoe.as_view(), name='create-shoe'),
    path('shoe/<int:id>/', FetchShoes.as_view(), name='shoe'),
    path('shoe_name/', FetchShoes_Name.as_view(), name='shoe_name'),
    path('create_tender/', CreateTender.as_view(), name='create-tender'),
    path('fetch_offers/', FetchOffer.as_view(), name='fetch-offer'),
    path('create_offer/', CreateOffer.as_view(), name='create-offer'),
    path('fetch-offers/', FetchOffers.as_view(), name='fetch_offers'),
    path('accept-offer/', AcceptOffer.as_view(), name='accept-offer'),
    path('fetch_tenders/', FetchTenders.as_view(), name='fetch-tenders'),
    path('accept-tender/', AcceptTender.as_view(), name='accept-tender'),
    path('create-qc/', CreateQualityControl.as_view(), name='create-qc')


]


