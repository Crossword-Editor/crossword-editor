from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


# from .models import ModelName
# admin.site.register(ModelName)

admin.site.register(User, UserAdmin)
