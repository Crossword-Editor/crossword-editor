from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField


class User(AbstractUser):
    pass


class Puzzle(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(
        to=User, related_name='chronicles', on_delete=models.CASCADE)
    data = JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Record(models.Model):
    puzzle = models.ForeignKey(
        to=Puzzle, related_name='puzzles', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    puzzle_status = models.CharField(max_length=1)

    def __str__(self):
        return f'{self.puzzle}: {self.puzzle_status}'
