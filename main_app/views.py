from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

def index(request):
    return render(request, 'pages/index.html')

# Create your views here.
def perform_login(request):
    message = ""
    if request.method == "POST":
        username = request.POST.get('userNameControlInput')
        password = request.POST.get('passwordControlInput')
        if check_user_exists(username):
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect('accueil')
            else:
                message = "Mot de passe incorrecte"
        else:
            message = "L'utilisateur n'existe pas dans la base de données"
            
    context = {"message" : message}
    return render(request, 'pages/login_page.html', context)


def perfom_inscription(request):
    message = ""  # Initialise le message
    show_popup = False  # Initialise la variable du pop-up

    if request.method == "POST":
        name = request.POST.get('nameControlInput')
        last_name = request.POST.get('lastNameControlInput')
        username = request.POST.get('userNameControlInput')
        email = request.POST.get('emailControlInput')
        password = request.POST.get('passwordControlInput')

        if check_user_exists(username):
            message = "L'utilisateur existe déjà dans la base de données."
        else:
            User.objects.create(username=username, password=password, email=email, first_name=name, last_name=last_name)
            show_popup = True  # Active le pop-up
    context = {"message": message, "show_popup": show_popup}
    return render(request, 'pages/inscription_page.html', context)

def check_user_exists(username):
    return User.objects.filter(username=username).exists()
