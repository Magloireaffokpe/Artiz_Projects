from rest_framework import generics, permissions
from .models import ArtisanProfile, Reservation
from .serializers import ArtisanSerializer, ReservationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsOwnerOrReadOnly

class ArtisanListView(generics.ListAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanSerializer
    permission_classes = [permissions.AllowAny]

class ArtisanDetailView(generics.RetrieveUpdateAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanSerializer
    permission_classes = [IsOwnerOrReadOnly]

class ArtisanSearchView(APIView):
    def get(self, request):
        metier = request.query_params.get("metier")
        location = request.query_params.get("location")
        qs = ArtisanProfile.objects.all()
        if metier:
            qs = qs.filter(metier__icontains=metier)
        if location:
            qs = qs.filter(address__icontains=location)
        serializer = ArtisanSerializer(qs, many=True)
        return Response(serializer.data)

# ✅ Réservation anonyme (plus besoin d’authentification)
class CreateReservationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, artisan_id):
        try:
            artisan = ArtisanProfile.objects.get(id=artisan_id)
        except ArtisanProfile.DoesNotExist:
            return Response({"detail": "Artisan non trouvé"}, status=404)

        client_name = request.data.get('client_name')
        client_email = request.data.get('client_email')
        client_phone = request.data.get('client_phone')
        address = request.data.get('address')
        description = request.data.get('description', '')

        if not all([client_name, client_email, client_phone, address]):
            return Response({"detail": "Tous les champs obligatoires doivent être remplis"}, status=400)

        reservation = Reservation.objects.create(
            artisan=artisan,
            client=None,  # anonyme
            client_name=client_name,
            client_email=client_email,
            client_phone=client_phone,
            address=address,
            description=description,
            status='pending'
        )

        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=201)

class ArtisanReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(artisan__user=self.request.user).order_by("-created_at")

class UpdateReservationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk, artisan__user=request.user)
        except Reservation.DoesNotExist:
            return Response({"detail": "Réservation non trouvée"}, status=404)

        status = request.data.get('status')
        if status not in dict(Reservation.STATUS_CHOICES):
            return Response({"detail": "Statut invalide"}, status=400)

        reservation.status = status
        reservation.save()
        return Response({"message": "Mis à jour", "status": reservation.status})
