---
marp: true
theme: uncover
_class: invert
---

# Crossword editor

A tool to author NY Times style crosswords.

________________
## Background

- Puzzles published 7 days a week, [reader](https://www.nytimes.com/2020/02/19/crosswords/constructor-crossword-puzzles-trudeau.html) submitted and edited by Will Shortz
- Generally start out easiest on Mondays and get harder throughout the week
- Usually 15x15, except for Sundays, usually 21x21
- Black squares are usually rotationally symmetric
- Thursdays and Sundays often have themes, hidden puzzles/rebuses, or other novel features

________________
<!-- _class: invert -->
### Nerdy subculture
- [https://www.xwordinfo.com/](https://www.xwordinfo.com/)
- [How to write a crossword](https://www.nytimes.com/2018/09/14/crosswords/how-to-make-a-crossword-puzzle-the-series.html)
- [Wordplay Documentary](https://smile.amazon.com/Wordplay-Will-Shortz/dp/B0019VA7K2/ref=sr_1_1?crid=1FIM2TA2B85CF&dchild=1&keywords=wordplay&qid=1584676659&sprefix=wordplay%2Caps%2C165&sr=8-1):
![](Wordplaymp.jpg)

________________
## The Competition
- Other programs that show up when searching for a crossword writing application are native apps that are platform specific or are a little costly.
- Screenshots of those other programs look a bit outdated
- Providing a web app could lend itself to collaboration
- [CrossFire](http://beekeeperlabs.com/crossfire/index.html) is probably the best option currently

________________
<!-- _class: invert -->
## Goals
- Let a user fill in a grid, clues, title, and description of a crossword
- Grid numbering and black square symmetry taken care of automatically
- Mimic the style of the [web](https://www.nytimes.com/crosswords/game/daily/2015/02/13) and mobile crossword apps from the NY Times
- Users can save drafts, make them public/private

________________
<!-- _class: invert -->
## Goals Cont.
- Human and computer friendly export options:
    - Export to [NY Times submission guidelines](https://www.nytimes.com/puzzles/submissions/crossword)
    - Computer friendly formats specified at [https://www.xwordinfo.com/](https://www.xwordinfo.com/)

________________
## What you can do
- Create a **clean** and **intuitive** interface.  Lots of JS to control navigating grid
- Figure out clever ways of using the data structures to our advantage, on the front and backend
- Learn how to export to different formats, e.g. pdfs, image formats, etc.
- Research: what would crossword authors want and expect to see?
- Should info be passed via forms? Ajax? What should the Django model(s) for a puzzle be?

________________
<!-- _class: invert -->
## Stretch Goals
- Users can add collaborators to coauthor puzzles.
- Comments so that authors can receive feedback on their puzzles <- hyperlinks to clues, grid numbers maybe? [Disqus](https://disqus.com/)?
- Stuck filling in a word? We could use a word bank to check for every possible solution
- Statistics about the current puzzle, e.g. word a letter counts, average word length, etc
- Bring in historical statistics from other sites, if available, e.g. how often a word has been used

________________
## Related Reading
In addition to the links in the above sections, some other things to look into are:
- [How to write a cross word, from the NY Times](https://www.nytimes.com/2018/09/14/crosswords/how-to-make-a-crossword-puzzle-the-series.html)
- [Across Lite (.puz) format](https://icrossword.com/publish/create.html)
- [CrossFire Docs](http://beekeeperlabs.com/crossfire/docs/index.html)
