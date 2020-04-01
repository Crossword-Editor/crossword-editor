import json

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods

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
@login_required
def save(request):
    json_string = request.body
    json_decoded = json.loads(json_string)
    pk = json_decoded['pk']
    puzzle = Puzzle.objects.get(pk=pk)
    puzzle.data = json_decoded
    puzzle.save()
    return JsonResponse({"message": "Puzzle saved to database"})


@csrf_exempt
@require_POST
@login_required
def mark_complete(request):
    json_string = request.body
    json_decoded = json.loads(json_string)
    pk = json_decoded['pk']
    puzzle = Puzzle.objects.get(pk=pk)
    puzzle.data = json_decoded
    puzzle.completed = True
    puzzle.save()
    return JsonResponse({"redirect": True})


@csrf_exempt
@login_required
def new(request):
    json_string = request.body
    json_decoded = json.loads(json_string)
    rowN, colN = int(json_decoded['rowN']), int(json_decoded['colN'])
    empty_grid = createEmptyGrid(rowN, colN)
    new_puzzle = Puzzle.objects.create(owner=request.user, data=empty_grid)
    return JsonResponse({"pk": new_puzzle.pk})


def createEmptyGrid(rowN, colN):
    puzzle = {"size": {"rowN": rowN, "colN": colN}}
    puzzle["title"] = "untitled"
    puzzle["grid"] = ['' for i in range(rowN*colN)]
    puzzle["clues"] = {"across": {}, "down": {}}
    puzzle["clues"]["down"] = {f'{i+1}': '' for i in range(colN)}
    puzzle["clues"]["across"] = {
        ('1' if i == 0 else f'{i+colN}'): '' for i in range(rowN)}
    return puzzle


@login_required
@csrf_exempt
@require_http_methods(['DELETE'])
def delete(request, pk):
    puzzle = Puzzle.objects.get(pk=pk)
    if puzzle.owner == request.user:
        puzzle.delete()
        return JsonResponse({
            "status": "ok",
            "message": "Successfully deleted"
        })
    else:
        return JsonResponse({
            "status": "not-ok",
            "message": "An error occured"
        })


def sort_by(queryset, option):
    options = {'date': 'puzzle__created__at',
               'date-reverse': 'puzzle__created__at',
               'title': 'puzzle__data__title'}
    return queryset.order_by(options[option])


# @login_required(login_url='/accounts/login')
# def puzzle_details(request, pk):
#     user = User.objects.get(username=request.user.username)
#     puzzles = Puzzle.objects.all()
#     puzzle = Puzzle.objects.get(pk=pk)
#     context = {'puzzle': puzzle, 'pk': pk}
#     return render(request, 'editor/puzzle_details.html', context=context)
