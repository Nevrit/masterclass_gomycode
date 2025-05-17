from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User

@csrf_exempt
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

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({'message': 'Connexion réussie', 'user': username}, status=200)
            else:
                return JsonResponse({'message': 'Identifiants incorrects'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': "Données invalides"}, status=400)
    
    return JsonResponse({'message': "Méthode non autorisée"}, status=405)  # Ajoute une réponse pour GET
    

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Déconnexion réussie'}, status=200)