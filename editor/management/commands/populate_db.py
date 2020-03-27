import json

from django.core.management.base import BaseCommand
from editor.models import Puzzle
from users.models import User


class Command(BaseCommand):
    help = 'Import all support Prism.js languages into db as Language instances'

    def handle(self, *args, **kwargs):
        with open('sample_puzzle.json', 'r') as f:
            puzzles = json.load(f)
        puzzle1 = puzzles['puzzle1']
        puzzle2 = puzzles['puzzle2']

        for user in User.objects.all():
            Puzzle.objects.update_or_create(owner=user, data=puzzle1, completed=False)
            Puzzle.objects.update_or_create(owner=user, data=puzzle2, completed=True)
