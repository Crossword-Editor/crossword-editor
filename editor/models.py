from django.db import models
from django.contrib.postgres.fields import JSONField

from users.models import User


class Puzzle(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(
        to=User, related_name='puzzles', on_delete=models.CASCADE)
    data = JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name
