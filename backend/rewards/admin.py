# rewards/admin.py
from django.contrib import admin
from .models import Reward

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "reward_type", "amount", "item_code", "status", "created_at")
    list_filter = ("reward_type", "status", "created_at")
    search_fields = ("user__username", "item_code", "mission_code")
