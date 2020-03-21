from django.shortcuts import render

# from .models import ModelName


def test(request):
    return render(request, 'base.html')
