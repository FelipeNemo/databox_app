from django.db.models.signals import pre_save, pre_delete, post_save, post_delete
from django.dispatch import receiver
from userauths.models import Profile, User

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        try:
            instance.profile
        except Profile.DoesNotExist:
            Profile.objects.create(user=instance)
