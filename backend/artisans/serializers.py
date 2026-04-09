from rest_framework import serializers
from .models import ArtisanProfile, Reservation

class ArtisanSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = ArtisanProfile
        fields = '__all__'
        # Ajouter les champs calculés
        extra_fields = ['user_first_name', 'user_last_name', 'user_phone']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['user_first_name'] = instance.user.first_name
        ret['user_last_name'] = instance.user.last_name
        ret['user_phone'] = instance.user.phone
        return ret

class ReservationSerializer(serializers.ModelSerializer):
    # Pour les réservations avec client connecté, on utilise client.first_name, etc.
    # Pour les anonymes, on utilise client_name, client_email, client_phone.
    client_display_name = serializers.SerializerMethodField()
    client_display_email = serializers.SerializerMethodField()
    client_display_phone = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = ['id', 'artisan', 'client', 'client_name', 'client_email', 'client_phone',
                  'description', 'address', 'status', 'created_at',
                  'client_display_name', 'client_display_email', 'client_display_phone']

    def get_client_display_name(self, obj):
        if obj.client:
            return f"{obj.client.first_name} {obj.client.last_name}"
        return obj.client_name

    def get_client_display_email(self, obj):
        if obj.client:
            return obj.client.email
        return obj.client_email

    def get_client_display_phone(self, obj):
        if obj.client:
            return obj.client.phone
        return obj.client_phone