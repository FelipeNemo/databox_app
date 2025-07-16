from django.contrib import admin
from userauths.models import Profile, User  # ✅ correto

class UserAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'gender', 'country']  # Corrigido 'contry' para 'country'
    search_fields = ['user__full_name', 'date']
    list_filter = ['date']
    
    def profile_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius:50%;" />', obj.image.url)
        return "(Sem imagem)"

    profile_image.short_description = "Imagem"


admin.site.register(User, UserAdmin)       # ✅ agora usa sua config personalizada
admin.site.register(Profile, ProfileAdmin) # ✅ idem