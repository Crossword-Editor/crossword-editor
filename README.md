# NY Times style crossword editor
A tool to write NY Times style crosswords. [Deployed site](https://crossword-editor.herokuapp.com/)

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
These are the names used in the updated .env.sample, so it is important to use them (or change them and update the .env file).

I also updated `config/.env.sample` so that the database url point to the right location, which requires the above names exactly.  So if you rerun:
```shell
cp config/.env.sample config/.env
```
then you should have the updated environment variables needed for postgres to work.

At this point, since we're using a new database, we need to migrate again:
```shell
python manage.py migrate
```
Hopefully, you see a lot of OK's.  Then try running the server to make sure everything is working.
