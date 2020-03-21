---
marp: false
---

# NY Times style crossword editor
A tool to write NY Times style crosswords.

## Postgres Setup
After then `posgres-heroku` branch has been merged into master and you've pulled the changes to your local repo,
you'll need to set up a postgres db locally.  First,
```shell
pipenv install
```
to get the new packages installed from the Pipfile.  Make sure this is successful; if not, contact me and we can troubleshoot.

Next,
```shell
createuser -d editor
createdb -U editor editor
```
This sets up a username and db, both with the same name, `editor`, which is the same name as our django app.

I also updated `config/.env.sample` so that the database url point to the right location, which requires the above names exactly.  So if you run
```shell
cp config/.env.sample config/.env
```
again, the postgres part should work.

At this point, since we're using a new database, we need to migrate again:
```shell
python manage.py migrate
```
Hopefully, you see a lot of OK's.  Then try running the server to make sure everything is working.

## Heroku Deployment



## Viewing the pitch slides
[pitch.md](pitch.md) was written with [Marpit: Markdown slide deck framework](https://marpit.marp.app/).

You can also install the [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) vscode extension to view slides with the markdown preview or to easily export to other formats.

You can also just read [pitch.md](pitch.md) as a plain text file of course 🙂