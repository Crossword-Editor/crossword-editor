from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

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


# def launch_home(request):
#     if request.user.is_authenticated:
#         return user_profile(request)
#     else:
#         return render(request, 'editor/base.html')


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


# @login_required(login_url='/accounts/login')
# def edit_puzzle(request, pk):
#     user = User.objects.get(username=request.user.username)
#     puzzles = Puzzle.objects.all()
#     puzzle = get_object_or_404(Puzzle, pk=pk)
#     context = {'puzzle': puzzle, 'pk': pk}
#     return render(request, 'editor/edit_puzzle.html', context=context)
