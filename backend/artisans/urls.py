from django.urls import path
from .views import *

urlpatterns = [
    path('artisans/', ArtisanListView.as_view()),
    path('artisans/<int:pk>/', ArtisanDetailView.as_view()),
    path('artisans/search/', ArtisanSearchView.as_view()),

    path('artisans/<int:artisan_id>/reserve/', CreateReservationView.as_view()),

    path('dashboard/reservations/', ArtisanReservationsView.as_view()),
    path('reservations/<int:pk>/status/', UpdateReservationStatusView.as_view()),
]