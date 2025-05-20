from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
import json
from django.contrib.auth.models import User
from .models import Ticket
from rest_framework.authtoken.models import Token
from django.views.decorators.http import require_POST

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': "CSRF cookie set"})

@require_POST
@ensure_csrf_cookie
def register_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            first_name = data.get('name') 
            last_name = data.get('lastName') 
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'message': "L'utilisateur existe déjà"}, status=400)

            User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
            return JsonResponse({'message': "Inscription réussie ! Vous pouvez maintenant vous connecter"}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'message': "Données invalides"}, status=400)

    return JsonResponse({'message': "Méthode non autorisée"}, status=405)  # Ajoute une réponse pour GET


@require_POST
@csrf_protect
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)  # ✅ Génère un token si l'utilisateur n'en a pas
                print(f"Session active : {token.key}")
                return JsonResponse({'message': 'Connexion réussie', 'token': token.key}, status=200)
            else:
                return JsonResponse({'message': 'Identifiants incorrects'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': "Données invalides"}, status=400)
    
    return JsonResponse({'message': "Méthode non autorisée"}, status=405)  # Ajoute une réponse pour GET
    

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Déconnexion réussie'}, status=200)

@csrf_protect
def dashboard_view(request):
    connected_user = request.user.is_authenticated
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            if connected_user:
                Ticket.objects.create(
                title = title,
                description = description,
                created_by = request.user
                )
                return JsonResponse({'message' : "Ticket crée avec succès"}, status=201)
            else:
                print(f'Utilisateur connecté : {request.user}') 
                return JsonResponse({"message": "Veuillez vous authentifier"}, status=401)
        except :
            return JsonResponse({"message" : "Impossible de créer le ticket 400"}, status=400)
    return JsonResponse({'message' : "Voici la page d'accueil"}, status=405)