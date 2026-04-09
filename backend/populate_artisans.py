import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'artiz.settings')
django.setup()

from users.models import User
from artisans.models import ArtisanProfile

artisans_data = [
    {
        "first_name": "Koffi",
        "last_name": "ADJOVI",
        "email": "koffi.adjovi@artiz.bj",
        "phone": "96123456",
        "metier": "plomberie",
        "address": "Cotonou, Haie Vive",
        "whatsapp_number": "96123456",
        "tariff_min": 5000,
        "tariff_max": 25000,
        "description": "Plombier professionnel avec 10 ans d'expérience. Travail soigné et devis gratuit."
    },
    {
        "first_name": "Aminatou",
        "last_name": "BIAOU",
        "email": "aminatou.biaou@artiz.bj",
        "phone": "96234567",
        "metier": "couture",
        "address": "Porto-Novo, Av. Steinmetz",
        "whatsapp_number": "96234567",
        "tariff_min": 3000,
        "tariff_max": 15000,
        "description": "Couturière spécialisée dans les tenues traditionnelles et modernes."
    },
    {
        "first_name": "Moussa",
        "last_name": "SALIFOU",
        "email": "moussa.salifou@artiz.bj",
        "phone": "96345678",
        "metier": "electricite",
        "address": "Cotonou, Gbégamey",
        "whatsapp_number": "96345678",
        "tariff_min": 7000,
        "tariff_max": 35000,
        "description": "Électricien certifié, installation et dépannage rapide."
    },
    {
        "first_name": "Claire",
        "last_name": "AGOSSOU",
        "email": "claire.agossou@artiz.bj",
        "phone": "96456789",
        "metier": "menuiserie",
        "address": "Abomey-Calavi, Ekpè",
        "whatsapp_number": "96456789",
        "tariff_min": 10000,
        "tariff_max": 60000,
        "description": "Menuiserie générale, meubles sur mesure et agencement."
    },
    {
        "first_name": "David",
        "last_name": "HOUNKPATIN",
        "email": "david.hounkpatin@artiz.bj",
        "phone": "96567890",
        "metier": "mecanique",
        "address": "Cotonou, Vèdoko",
        "whatsapp_number": "96567890",
        "tariff_min": 5000,
        "tariff_max": 30000,
        "description": "Mécanicien auto, diagnostic électronique, réparation tous modèles."
    },
    {
        "first_name": "Fatoumata",
        "last_name": "DIALLO",
        "email": "fatoumata.diallo@artiz.bj",
        "phone": "96678901",
        "metier": "coiffure",
        "address": "Cotonou, Fidjrossè",
        "whatsapp_number": "96678901",
        "tariff_min": 2000,
        "tariff_max": 8000,
        "description": "Coiffure pour dames et hommes, tresses, coupes, soins."
    },
    {
        "first_name": "Romuald",
        "last_name": "DAKPO",
        "email": "romuald.dakpo@artiz.bj",
        "phone": "96789012",
        "metier": "plomberie",
        "address": "Cotonou, Akpakpa",
        "whatsapp_number": "96789012",
        "tariff_min": 6000,
        "tariff_max": 30000,
        "description": "Plomberie, installation de chauffe-eau et climatisation."
    },
    {
        "first_name": "Béatrice",
        "last_name": "TOHO",
        "email": "beatrice.toho@artiz.bj",
        "phone": "96890123",
        "metier": "couture",
        "address": "Cotonou, Dantokpa",
        "whatsapp_number": "96890123",
        "tariff_min": 2500,
        "tariff_max": 12000,
        "description": "Couturière spécialisée dans les tenues de cérémonie."
    },
    {
        "first_name": "Issa",
        "last_name": "BOUKARI",
        "email": "issa.boukari@artiz.bj",
        "phone": "96901234",
        "metier": "electricite",
        "address": "Parakou, Gbégbé",
        "whatsapp_number": "96901234",
        "tariff_min": 8000,
        "tariff_max": 40000,
        "description": "Électricien industriel et domestique."
    },
    {
        "first_name": "Gisèle",
        "last_name": "HOUNSA",
        "email": "gisele.hounsa@artiz.bj",
        "phone": "97012345",
        "metier": "menuiserie",
        "address": "Porto-Novo, Ouando",
        "whatsapp_number": "97012345",
        "tariff_min": 12000,
        "tariff_max": 70000,
        "description": "Menuiserie aluminium et bois."
    },
]

for data in artisans_data:
    user, created = User.objects.get_or_create(
        email=data["email"],
        defaults={
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "phone": data["phone"],
            "is_artisan": True,
        }
    )
    if created:
        user.set_password("artiz123")  # mot de passe commun
        user.save()
        ArtisanProfile.objects.create(
            user=user,
            metier=data["metier"],
            address=data["address"],
            whatsapp_number=data["whatsapp_number"],
            tariff_min=data["tariff_min"],
            tariff_max=data["tariff_max"],
            description=data["description"],
        )
        print(f"✅ Artisan créé : {data['first_name']} {data['last_name']} - {data['metier']}")
    else:
        print(f"⚠️ L'utilisateur {data['email']} existe déjà, ignoré.")