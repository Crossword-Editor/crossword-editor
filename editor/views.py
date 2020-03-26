import json

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Puzzle


def home(request):
    if not request.user.is_authenticated:
        return render(request, 'editor/welcome.html')
    drafts = request.user.puzzles.filter(completed=False)
    completes = request.user.puzzles.filter(completed=True)
    context = {'drafts': drafts, 'completes': completes}
    return render(request, 'editor/user_home.html', context=context)


@login_required
def edit(request, pk):
    puzzle = get_object_or_404(Puzzle, pk=pk)
    if request.user == puzzle.owner:
        context = {'puzzle': puzzle.data, 'pk': pk}
        return render(request, 'editor/edit_puzzle.html', context=context)
    else:
        redirect('home')


@csrf_exempt
@require_POST
def save(request):
    json_string = request.body
    json_decoded = json.loads(json_string)
    pk = json_decoded['pk']
    puzzle = Puzzle.objects.get(pk=pk)
    puzzle.data = json_decoded
    puzzle.save()
    return JsonResponse({"message": "Puzzle saved to database"})


# @login_required(login_url='/accounts/login')
# def puzzles_complete(request):
#     user = User.objects.get(username=request.user.username)
#     puzzles = Puzzle.objects.all()
#     context = {'puzzles': puzzles}
#     return render(request, 'editor/puzzles_complete.html', context=context)


# @login_required(login_url='/accounts/login')
# def puzzle_details(request, pk):
#     user = User.objects.get(username=request.user.username)
#     puzzles = Puzzle.objects.all()
#     puzzle = Puzzle.objects.get(pk=pk)
#     context = {'puzzle': puzzle, 'pk': pk}
#     return render(request, 'editor/puzzle_details.html', context=context)


# @login_required(login_url='/accounts/login')
# def add_puzzle(request, pk):
#     puzzles = Puzzle.objects.all()
#     context = {'puzzles': puzzles}
#     return render(request, 'editor/add_puzzle.html', context=context)
