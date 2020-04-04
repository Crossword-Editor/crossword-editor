import json

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.template.loader import render_to_string
from django.utils.text import slugify

from weasyprint import HTML, CSS

from .models import Puzzle
from users.models import User


def home(request):
    if not request.user.is_authenticated:
        return render(request, 'editor/welcome.html')
    drafts = request.user.puzzles.filter(completed=False)
    completes = request.user.puzzles.filter(completed=True)
    sort_option = request.GET.get('sort', 'modified')
    drafts = sort_by(drafts, sort_option)
    completes = sort_by(completes, sort_option)
    context = {'drafts': drafts, 'completes': completes}
    return render(request, 'editor/user_home.html', context=context)


@login_required
def edit(request, pk):
    puzzle = get_object_or_404(Puzzle, pk=pk)
    if request.user == puzzle.owner:
        js_boolean = 'true' if puzzle.completed else 'false'
        context = {'puzzle': puzzle.data, 'pk': pk, 'completed': js_boolean }
        return render(request, 'editor/puzzle.html', context=context)
    else:
        redirect('home')


@login_required
def review_complete(request, pk):
    puzzle = get_object_or_404(Puzzle, pk=pk)
    if request.user == puzzle.owner:
        js_boolean = 'true' if puzzle.completed else 'false'
        context = {'puzzle': puzzle.data, 'pk': pk, 'completed': js_boolean }
        return render(request, 'editor/puzzle.html', context=context)
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
@login_required
def ny_times_pdf(request, pk):
    form_data = json.loads(request.body)
    puzzle_obj = Puzzle.objects.get(pk=pk)
    puzzle = puzzle_obj.data
    grid, gridnums, clues, answers = puzzle['grid'], puzzle['gridnums'], puzzle['clues'], puzzle['answers']
    colN = puzzle['size']['colN']
    rows = [[(gridnums[i+j*colN], grid[i+j*colN])
             for i in range(colN)] for j in range(colN)]
    across = sorted(clues['across'].items(), key=lambda x: int(x[0]))
    down = sorted(clues['down'].items(), key=lambda x: int(x[0]))
    across = [list(pair) for pair in across]
    down = [list(pair) for pair in down]
    for i, pair in enumerate(across):
        pair.append(answers['across'][i])
    for i, pair in enumerate(down):
        pair.append(answers['down'][i])

    context = {'puzzle': puzzle, 'rows': rows,
               'across': across, 'down': down, 'address': form_data}
    html = render_to_string('editor/ny_times_pdf.html', context=context)
    # css = CSS('static/css/ny_times_pdf.css')
    filename = "nyt_format.pdf"

    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = f"attachment; filename={filename}"
    HTML(string=html).write_pdf(response)
    return response


@csrf_exempt
@login_required
def toggle_complete(request):
    if request.method == 'POST':
        json_string = request.body
        json_decoded = json.loads(json_string)
        pk = json_decoded['pk']
        puzzle = Puzzle.objects.get(pk=pk)
        puzzle.data = json_decoded
        puzzle.completed = True
        puzzle.save()
        return JsonResponse({"redirect": True})

    else:
        pk = int(request.GET.get('pk'))
        puzzle = Puzzle.objects.get(pk=pk)
        puzzle.completed = False
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
    puzzle['symmetry'] = 'rotational'
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
    options = {'date': '-created_at',
               'date-rev': 'created_at',
               'modified': '-updated_at',
               'modified-rev': 'updated_at',
               'title': 'data__title'}
    return queryset.order_by(options[option])


# @login_required(login_url='/accounts/login')
# def puzzle_details(request, pk):
#     user = User.objects.get(username=request.user.username)
#     puzzles = Puzzle.objects.all()
#     puzzle = Puzzle.objects.get(pk=pk)
#     context = {'puzzle': puzzle, 'pk': pk}
#     return render(request, 'editor/puzzle_details.html', context=context)


def user_pdf(pk):
    """For previewing nyt pdf output styling"""
    puzzle_obj = Puzzle.objects.get(pk=pk)
    puzzle = puzzle_obj.data
    grid, gridnums, clues, answers = puzzle['grid'], puzzle['gridnums'], puzzle['clues'], puzzle['answers']
    colN = puzzle['size']['colN']
    rows = [[(gridnums[i+j*colN], grid[i+j*colN])
             for i in range(colN)] for j in range(colN)]
    across = sorted(clues['across'].items(), key=lambda x: int(x[0]))
    down = sorted(clues['down'].items(), key=lambda x: int(x[0]))
    across = [list(pair) for pair in across]
    down = [list(pair) for pair in down]
    for i, pair in enumerate(across):
        pair.append(answers['across'][i])
    for i, pair in enumerate(down):
        pair.append(answers['down'][i])

    context = {'puzzle': puzzle, 'rows': rows,
               'across': across, 'down': down}
 userprintoptions
    html = render_to_string('editor/user_pdf.html', context=context)
    css = CSS('static/css/user_all_pdf.css')
    HTML(string=html).write_pdf('./output.pdf', stylesheets=[css])

    html = render_to_string('editor/ny_times_pdf.html', context=context)
    # css = CSS('static/css/ny_times_pdf.css')
    filename = "nyt_format.pdf"

    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = f"attachment; filename={filename}"
    HTML(string=html).write_pdf('./output.pdf')
