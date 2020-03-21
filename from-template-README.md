# Django Project Template

This project was generated from the Momentum Django project template. This template sets up some minimal changes:

- [django-extensions](https://django-extensions.readthedocs.io/en/latest/) and [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/en/latest/) are both installed and set up.
- [django-environ](https://django-environ.readthedocs.io/en/latest/) is set up and the `DEBUG`, `SECRET_KEY`, and `DATABASES` settings are set by this package.
- There is a custom user model defined in `users.models.User`.
- There is a `templates/` and a `static/` directory at the top level, both of which are set up to be used.
- A `.gitignore` file is provided.
- Pipenv is used to manage dependencies.

## Using this template

In an empty directory, run:

```
pipenv --three
pipenv install django
pipenv shell
rm Pipfile Pipfile.lock
django-admin startproject --template=https://github.com/momentumlearn/django-project-template/archive/master.zip <your_project_name> .
pipenv install
cp <your_project_name>/.env.sample <your_project_name>/.env
./manage.py migrate
```

Remember to change `<your_project_name>` to your actual project name. We remove `Pipfile` and `Pipfile.lock` at the beginning because django-admin will not overwrite them with the new ones from our template.
