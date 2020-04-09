## BRIAN:
Hello, my name is Brian Bonsignore.
Cohort7 colleague Cheryl Summers and I collaborated to design a New York Times-styled crossword puzzle
authoring tool called, “WordNerd.”
I started solving puzzles with my fiancee when we first starting dating a few years ago, and we still solve them together when we have free time in the evenings.
I have since wanted to try my hand at writing and submitting a puzzle to be published in the New York times,
but the crossword authoring programs were out there are native apps that are either platform specific, or come with a price tag that I couldn't afford at the time.
And now I'll Cheryl introduce herself and start demoing the app.


This online application is intended not only for cruciverbalists
– yeah, there’s a name for crossword aficionados –
but also for anyone wishing to create puzzles as a personal hobby.
Thus, I used it as an opportunity to learn about web development to create a free web app that provides the
features a seasoned or budding puzzle writer would expect, including export to the submission format required
by the NY times.

I'll hand it over to Cheryl to demonstrate some of the features we've provided.

## CHERYL:
Thanks for the introduction Brian.
Hi folks. I’m Cheryl Summers and as Brian already mentioned, we’ve built WordNerd to quench the thirst of cruciverbalists and logophiles, alike.
Oh yeah, there’s a word for word lovers too! Hey follow me to have a look at WordNerds.
First stop: our landing page, where you may Login or, Register if you do not have an existing WordNerd account.
Once logged, your Homepage will list all the puzzles you have drafted, those you have finished, and a button which allows you to create a New puzzle. Let’s do that. A new puzzle will default to a standard 15x15 puzzle grid, but you can change the size at your discretion.
You’re immediately taken to your puzzle grid editing page, which we’ve loaded with other helpful tabs like the Puzzle Properties, where you can name your puzzle, add a description, and save your preferences.
Select the ‘Navigate’ tab for a list of tips we’ve added to ensure a smooth experience.
Add placeholder “Enter Clue” for the clue entry field
**Note: It may be slightly more realistic to fill in some words and black squares on the grid first, to point out**
**how the black square symmetry is kept and the numbering updates, plus puzzle authors would typically write**
**the clues only after the grid is filled in**
We’re going to add just a couple clues. I click into the clue entry field; let’s see, how about, 2020 ubiquitous remote communication method. For __ across, that would be “VIRTUAL”. Enter a period into the next cell to separate new words. Then let’s say, ATC company that provides full stack immersive training.
For __ down, that would be Momentum. You get the idea right?
I’m going to SAVE what I’ve entered, click on the WordNerd icon to return to my homepage!
And there’s my custom-made puzzle listed in my drafts.
I’m going to pass the baton to Brian for discussion about the actual code that makes WordNerd possible!

## BRIAN:
Thanks Cheryl. We store the puzzle data in json, which we can save in a JsonField using our postgres/django backend.
On the frontend, we learned about and employed Vue.js.
It provided an efficient way to keep the user's input synced up with the json data we save to the database since Vue
handles data in a reactive way.
Moreover, we wrote components, e.g. for the cells and clues, that keep track of their own state and update their style accordingly.

To create the pdf exports, we used a html to pdf conversion tool called WeasyPrint
Now Cheryl is going to talk about the export features.

## CHERYL:
We expect that WordNerders will want to export a puzzle to a file to submit for publication or share with others.

From the user’s Homepage, let’s click on a completed puzzle.
Then, select the Export tab, which displays the Print to PDF and  Download to JSON options.
**Not complete yet: Print to PDF will prompt the user to save the puzzle in its current status – draft or completed – to the user’s preferred local directory.**
Download to JSON will prompt the user to open with an app of their choice or autosave in JSON format to the downloads folder.
When opened and saved in .txt format (**Also needs completing**), the puzzle may be uploaded to Across Lite a software for interactively solving a puzzle and sharing with others.

Finally, you can choose to export the puzzle to a pdf that conforms to the submission guidelines required by the New York times (which would merit at least several hundred dollars if it's accepted 🤑).

## BRIAN:
Thanks for listening.  Please feel welcome to ask us anything.