from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# from .models import ModelName


def test(request):
    return render(request, 'base.html')
