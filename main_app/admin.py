from django.contrib import admin
from .models import Ticket

# Register your models here.
class TicketAdmin(admin.ModelAdmin):
    list_display = ["title", "status", "created_at", "updated_at", "created_by"]
    search_fields = ["title", "status", "created_at", "updated_at", "created_by"]
    
admin.site.register(Ticket, TicketAdmin)