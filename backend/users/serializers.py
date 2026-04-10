from rest_framework import serializers
from .models import User
from artisans.models import ArtisanProfile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Serializer pour l'inscription
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    metier = serializers.CharField(write_only=True, required=False, allow_blank=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    whatsapp_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    tariff_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    tariff_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    description = serializers.CharField(write_only=True, required=False, allow_blank=True)
    profile_picture = serializers.ImageField(write_only=True, required=False)
    

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'phone', 'is_artisan',
            'metier', 'address', 'whatsapp_number', 'tariff_min', 'tariff_max',
            'description', 'profile_picture'
        ]

    def create(self, validated_data):
        artisan_fields = ['metier', 'address', 'whatsapp_number', 'tariff_min', 'tariff_max', 'description', 'profile_picture']
        artisan_data = {k: validated_data.pop(k) for k in artisan_fields if k in validated_data}
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            is_artisan=validated_data.get('is_artisan', False),
            password=validated_data['password'],
        )
        if user.is_artisan:
            for key in list(artisan_data.keys()):
                if artisan_data.get(key) in [None, '']:
                    artisan_data[key] = None
            ArtisanProfile.objects.create(user=user, **artisan_data)
        return user

# ✅ Serializer JWT personnalisé (ajoute is_artisan et artisan_id)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['is_artisan'] = user.is_artisan
        if user.is_artisan and hasattr(user, 'artisan_profile'):
            data['artisan_id'] = user.artisan_profile.id
        return data