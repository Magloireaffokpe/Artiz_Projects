from django.db import models
from users.models import User

class ArtisanProfile(models.Model):
    METIER_CHOICES = [
        ('plomberie', 'Plomberie'),
        ('couture', 'Couture'),
        ('menuiserie', 'Menuiserie'),
        ('electricite', 'Électricité'),
        ('mecanique', 'Mécanique'),
        ('coiffure', 'Coiffure'),
        ('autre', 'Autre'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artisan_profile')
    metier = models.CharField(max_length=100, choices=METIER_CHOICES)
    description = models.TextField(blank=True)
    tariff_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tariff_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    address = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    whatsapp_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.first_name} - {self.metier}"


class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Refusée'),
        ('completed', 'Terminée'),
    ]

    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name='reservations')
    # client devient optionnel (anonyme)
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # Champs pour les infos client (anonyme ou non)
    client_name = models.CharField(max_length=100)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=20)

    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client_name} → {self.artisan.user.first_name}"