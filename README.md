# WebsiteAssignmentMSC2019

//---------------------------------------------------------------------------

01-Oct-2019 - Mike Knight

I have added an authenticate module with the following API’s

- Login

The router maps /login to this api and the username and password is parsed from the query string (may want to change that?) and reruns a jwt token in a cookie. It is set as a cookie rather than a bearer token in the header because it is very difficult to intercept href calls client side. However, cookies are automatically transmitted hence the decision to go with that mechanism.

- Authenticate

The router can use this API to authenticate access to restricted resources. For now, I have set this to anything in the new user directory I have created. I have moved the betting page into this directory which means you now need to be logged in to see that page. If you are not authenticated it redirects the client to the login screen.

Client-side changes

I have added a basic login screen and some client-side java script to call the server login API when you click the login button. It then redirects you to the index page. The session currently only lives for 30 seconds before it expires this is just to allow us to easily see and test that expiry logic for now.

The username and password for logging in is bob and pass. This is currently hardcoded and needs to come from a database instead. I wanted to keep it really simple for now and once everyone understands someone else can maybe use the controller to grab and validate the user properly.

Controller module started

I have started a controller module that encapsulates all the database code and has a couple of APIs for getting users. This under the hood is just using the films database example for the labs and needs changing for our own collection of users but its just to show how it can be done. Again, maybe someone else can enhance implement this further?

I have exposed the getUsers API as a REST end point at /api/users so you can test through a web page.

//---------------------------------------------------------------------------

04-Oct-2019 - Mike Knight

Changes to authenticate module - removed redirect login from module so it could be used for the rest api without a ridirect happening. The router now handles wat to do with unauthenticated requestes as they should be different between web pages and rest apis

Added stub functions for registering new users into the controller router and added client side form to invoke the rest api.

//---------------------------------------------------------------------------

08-Oct-2019 - Sully

Navigation bar has been added with additional pages, which are now all interlinked. Partials have been added which will replace the html files in due course. The work is merged with the previous commit, integrating all the work together.

Teams, Games and Matches added to the database. You can now pull the data from the database in the form of a json file. Data of the collections have been added in the file structure as json data.

Need to create default data for the database using the 2 json files, follow the instructions that was covered in the seminar for this specific topic.

//---------------------------------------------------------------------------

09-Oct-2019 - Sully

Database updated with placeholders for the teams that is indexed inside the arrays of the Game collection. Partial has been created for matches which now show placeholders for fixtures to be present. Mike is going to work on how to fill these placeholders in with the teams and their information.

//---------------------------------------------------------------------------

09-Oct-2019 Mike Knight

Code to create full model by replacing team id in the matches array with the team objects. This is so the names and image paths can be used in rendering the view of the current game to bet on.

//---------------------------------------------------------------------------

11-Oct-2019 Mike Knight

Enhanced matches partial view to look more like the template Gemma created. Dropped the matches down to one per row to make it more mobile friendly. Added a buttom to the bottom that will require an click handler for grabbing all the prediction values and submits them to the server.

//---------------------------------------------------------------------------

13-Oct-2019 Mike Knight

Have done a big tidy up of the project. All undeeded HTML files have been removed to reduce chance of confusion as I noticed 2 copies of bettingPage was already in there. We dont want a repeat of the routes issue hey Sully ;-)

I have done a bit of a tidy up of the nav bar and converted the landing page to an ejs file. Some of the links have also been updated too. For now the landing page shows you this weeks bets. Thought that was a nice idea?

The nav bar can now detect if a user is logged in and shows either login\register or logout.

Only remaining .html pages are login and register which will be converted to ejs shortly.

//---------------------------------------------------------------------------

14-Oct-2019 Gemma

Transferred some css formatting to the main.css page, hopefully to fix the spinbox issues. However this formatting has caused the matches to flex weirdly on the page, so we will still need to work on that.

Converted register.html page to ejs and deleted old register.html page, have added a route to router.js so that the register page can now be accessed from main index page

Should also now be able to see the javascript on controller.js and client.js that allows us to save newly registered users to our user database on Mongo

Edit/update: also reformatted the matches ejs so that the matches don't overlap, and changed the client.js redirect from "index.html" to "/" so that it goes back to the main index page

To do: I have begun creating a login.ejs which I will update in due course. I will then delete login.html

//---------------------------------------------------------------------------

14-Oct-2019 Mike Knight

Merged Gemmas changes into the main code. Fixed a couple of issues caused by the merge and did yet another tidy!

Moved the login API to api\login in case Gemma wants to map the login ejs to the \login route.

Finished off authentication so it now will authenticate the provided details against the databse.

//---------------------------------------------------------------------------

16-Oct-2019 Gemma

Created a login ejs which now links to the main index page so that when the login button is clicked on, it will direct to the login ejs. The nav bar will also still display the logged out version until someone has logged in.

Anywhere linked to login.html has now had it replaced by "/login" for login.ejs

Apologies, my Prettier add-on has insisted on formatting everything on separate lines, so you might want to re-format if it makes it easy to read.

//---------------------------------------------------------------------------

17-Oct-2019 Gemma

Added error function: when you click submit on the register page, if the username field is blank then "username cannot be blank" will appear just above submit button.

I'm trying to make the error message a red colour, but .error {color: red} isn't working in the main.css stylesheet, which makes me think that the bootstrap styling might be overriding it for some reason.

Also linked the main index page to the Super6 button on the nav bar to make it easier to navigate back to the home page.

Also tidied up the html of the matches on the main.ejs page so that they're not all over the place! Team logos and names are still hard-coded for now, but can be changed in due course

//---------------------------------------------------------------------------

18-Oct-2019 Mike Knight

Merge of Gemmas work from branch to master. There was a little bug where the client side js was not being included with ejs which i have fixed by including in in head.ejs

edit\* moved users.json, removed betting page and made main page render matches from databse

//---------------------------------------------------------------------------

21-Oct-2019 Gemma

Reformatted the error messages on register.ejs

//---------------------------------------------------------------------------

21-Oct-2019 Mike Knight

Added a game module with a timer that will fire when the matches are set to start. This will invoke the main game logic of the website.

Fixed a small bug where clicking the home page went to the wrong route.

//---------------------------------------------------------------------------

21-Oct-2019 Sully

Added a updated_user.json with a example model for user predictions and results.

//---------------------------------------------------------------------------

21-Oct-2019 Mike Knight

Made some changes to authentication, added a logout API and hooked it up to the nav bar. The API basically clears the access_token cookie.

Moved the JWT secret to an env vairable, it should ideally go in env.secret but its fine for this protoype and makes it available system wide.

General tidy up of the authenticate module.

//---------------------------------------------------------------------------

22-Oct-2019 Gemma

Register page now displays error message if fields are left blank, but customer information remains in any fields that have already been filled in

//---------------------------------------------------------------------------

24-Oct-2019 Gemma

game.js has been set up by Michael and I'm trying to add some game logic that allows a random score to be generated in multiples of 10 (as per quidditch rules), and the score should be weighted by the skill level of the team (skill level between 0 and 1), so that multiplying the score by the skill level gives an overall weighted score, which can then be returned to the results page.

I've also added a Golden Snitch section to the betting/matches page as that it something we wanted to add.

Some of the team logos have had their background removed/turned transparent just in case we want a coloured background

Tweaked some of the css but still can't get the divs to align properly on betting/matches page

//---------------------------------------------------------------------------

24-Oct-2019 Mike Knight

Added a new getUsername API in the authenticate module. This extracts the username string from the encrypted JTW token and returns it.

If the returned string is null it means the user is not logged in. If you get a valid string you can assume the user is authenticated.

//---------------------------------------------------------------------------

25-Oct-2019 Gemma

game.js now contains some basic functions including creating a random score, taking an array of predicted scores and actual scores and converting it to a userscore array. The idea is to eventually have this userscore updated each week to form a grand total for each user, which can then be compared on a leaderboard.

Note: Some of the team logos have also been updated to pngs with transparent background in case we wanted coloured backgrounds on our website - it's worth dropping your teams database on MongoDB and re-importing it as the teams json found on this master commit, and then any disappearing team logos should reappear!

//---------------------------------------------------------------------------

27-Oct-2019 Mike Knight

Moved all code from app.js into a new server module. This is because await is not allowed in the top level script and we need to await on the database connection before running the rest of the code. If you dont you can get into a position where modules are trying to access collections before the database connection is established. I also changed the connect function in the controller module to return a boolean promice that can be awaited on.

Made some simplifications to the data model for the user. This new format is in updated user.json. I would recommend inporting this single user into the databse for you intitial state as the rest of the code assumes the data model is in that format.

Made the game module work with the data from the user collection instead of dummy data.

Wrote a some code for Ben to help him with getting the predictions from the form data into the user in the database.

NOTE: Some work needs to be done on registration to create the games collection on a new user before inserting them into the databse.

//---------------------------------------------------------------------------

28-Oct-2019 Mike Knight

Made some changes to login screen to display errors like the registration page. This is done client side however to demonstrate use of ajax within the website.

//---------------------------------------------------------------------------

29-Oct-2019 Gemma

Added some more game logic with Mike's help, 150 snitch points are now randomly assigned to one team per match (recommended that this is eventually weighted using team's skill advantage)

A user's total score is now updated to add points for correctly guessing the time the first snitch is caught and the first team to catch the snitch in any match within a game

I'm also trialling adding some more design stuff to the main page and changing the css styling of the spinbox arrows to something more suitable e.g. icons (Ben is also looking into this)

//---------------------------------------------------------------------------

29-Oct-2019 Ben

Updated addUserPredictions with the help of Mike's script. User predictions now post in the ccrrect format to the the user's document in the users collection.

NOTE: Going to be working on a "gameRound" function, to help set a global round so all users are posting their results to the same gameID. (at the moment they are all posting to "gameID: 1")

//---------------------------------------------------------------------------

29-Oct-2019 Mike Knight

Created a new databaseInitialiser module that runs on server start and sets up ModgoDB with the content of our data directory. I have tweaked the json to match what the code expects.

By default it will recreate the database every time you start the server but you can tun this off if you want to persist new users you have created for example.

To turn this off change this 'server.runServer(3000, true)' to this 'server.runServer(3000, false') in app.js

I have added a new function called prependNewGameData to the controller module which is used when registering a new user to add a initial game for them to place predictions on. I have also added it into the gameLogic function so once the users scores have been calculated for the current game a new object for the next game will be created.

//---------------------------------------------------------------------------

30-Oct-2019 Gemma

Added quidditch pitch background, did some styling for the web pages - still needs some fixing

Added black transparent box to better display matches and used z-index to bring the logos to the forefront so that they're not turned transparent as well

Moved matches styling to matches.css from main.css, because main.css was starting to get out of hand!

Added Mike's footer stylings so we now have a proper footer.

Re-scaled some of the team logos so they're now all a uniform size, which should make them easier to format

Some other issues that need fixing:
= When scrolling on the page, the black box and matches scroll over the top of the nav bar and footer
= For the matches, table-rows needs to be formed of 2 matches each, so there should be 3 table-rows consisting of 2 matches. Because of the ejs for loop, table-rows is currently 1 row holding all six matches!
= Some UI stuff like adding a banner at the top of the page saying "thank you for registering" once people have registered
= Some UI stuff like adding people's usernames at the top of the navbar once they've logged in

//---------------------------------------------------------------------------

30-Oct-2019 Mike Knight

Created a beta live view - This is a next potential evolution of the game logic where instead of final scores being instantly calculated they are incrementally created over a longer period to simulate a real set of games being played.

Currently I have just created a module that increments scores randomly every two seconds and provides the reuslts via an API. These results are blended with the game data model and rendered using EJS to show the results for each team.

A client side timer is used to refresh the page every 3 seconds which creates the live updating.

//---------------------------------------------------------------------------

31-Oct-2019 Gemma

Matches no longer scroll over navbar or footer, minor styling details fixed, added crossed brooms png to replace plain "V" sign after feedback that it wasn't that clear was the V was

Replaced black transparent box with simply setting table-rows as black/transparent

//---------------------------------------------------------------------------

31-Oct-2019 Ben

Updated the addUserPredictions functions.

NOTE: If you register a new user, make sure you log out when the server crashes. The database gets re-initiallised and will delete your user data.

//---------------------------------------------------------------------------

01-Nov-2019 Sully

A results page has been created and dummy data from the routes page has been displayed on the page. Will need to now manipulate the correct data from the database and display it on the results page. The results page needs styling.

//---------------------------------------------------------------------------

01-Nov-2019 Mike Knight

Merged Sullys changes in, Split routes page in two, one for views and one for API. Added API to start game on the fly from browser, will be used in demo.

Made nave bar results page link to results page.

//---------------------------------------------------------------------------

01-Nov-2019 Mike Knight

Work on game logic, mostly done, calculates snitch team too. Just needs weighted scores doing.

//---------------------------------------------------------------------------

04-Nov-2019 Gemma

Changed some styling on the Golden Snitch box on the matches page and made the submit button more visible.

//---------------------------------------------------------------------------

05-Nov-2019 Gemma

Changed the css-styled arrows to png icons and cleaned up UI layout of the matches.

Switched the cursor to "pointer" when hovering over arrows just to give some level of response when scaling up and down the match points.

Update: used bootstrap to re-format register page and login page

//---------------------------------------------------------------------------

05-Nov-2019 Mike Knight

Made some refinements to user predictions so the snitch predicitons and game id is stroed for the user

//---------------------------------------------------------------------------

05-Nov-2019 Mike Knight

Added get team function, example usage below:

    let team = await controller.getTeam(app, 1)
    let team2 = await controller.getTeam(app, parseInt('2'))

Game logic changed to give points for guessing winning team or draw correctly. Scores also created using skill advantage as multiplier

//---------------------------------------------------------------------------

06-Nov-2019 Mike Knight

Fixed bug in nav bar where login, register and logout was not showing when collapsed on mobile.

//---------------------------------------------------------------------------

06-Nov-2019 Ben Berhanu

Finished User Scores Predictions post.

Minor Tweaks to Snitch box and added aria-labels to all input elements for accessability. Modified HTML for more semantic reading (changing some divs to main, section and articles). Added some CSS fixes for Flexbox view in Vivaldi Browser

Getting of user scores is nearly done, added a condition that checks whether the teamID returns a value, if not it sets teamName to "Select a Team", this helps when users don't submit a team
Need help figuring out the EJS template forEach loop to display the user scores. Older method displays the first 2 scores in the array.

Exported isPredictionAvailable from game.js

//---------------------------------------------------------------------------

07-Nov-2019 Gemma

Fixed the plus/minus buttons for the golden snitch predictions and other small style changes
reading

//---------------------------------------------------------------------------

07-Nov-2019 Mike Knight

Added support for rendering the users score predictions into the matches pages.

//---------------------------------------------------------------------------

08-Nov-2019 Mike Knight

Fixed bug with predicting first team to catch the snitch.

//---------------------------------------------------------------------------

08-Nov-2019 Ben Berhanu

Minor CSS tweaks for matchs, changes each of the EJS pages and made sure they are more accessable (lowest score is 97) and made tiny semantic changes

//---------------------------------------------------------------------------

08-Nov-2019 Sully Ahmed

Results page has the right data displaying for the scores, results, and predictions being shown. A for-loop was made in order to loop through the appropiate data in the database. Along with adding an array in the database for the user scores. The result page has been styled with the appropiate theme all that needs to be done is the styling which I will get on to in due course.

A leaderboard page has been created, it needs styling and appropiate data needs to be displayed. That is my next task after styling and rendering the results page correctly.

//---------------------------------------------------------------------------

08-Nov-2019 Mike Knight

Tweaks to rendering of match views, only pass in a single game now instead of the array as it was rendering all the matches from all games.

More work on the live game module. Created a mechanism to control the simulation duration and extracted the code that calculates scores into a new gameUtils module. The code for calculating scores can now be used by both modules and the live module can use it to calculate the current user scores from the live data.

//---------------------------------------------------------------------------

13-Nov-2019 Sully Ahmed

Results page is almost complete, first golden snitch time prediction and result has been rendered into the page. Results banner for the user to see appropiate data has been added to the top of the results page and has been styled. Most of the styling is complete with a few styling issues that need resolving. Once they have been fixed then need to make sure it is fit for mobile view, which will then signify the completion of the results page.

//---------------------------------------------------------------------------

18-Nov-2019 Mike Knight

Work on REST api's to support building a live results page using client side js instead of rendering the results using ejs on the server.

//---------------------------------------------------------------------------

18-Nov-2019 Gemma

Working on the lock-in scores on live results page, and some reformatting on the results page

//---------------------------------------------------------------------------

19-Nov-2019 Gemma

Results page now styled more clearly

Locked in button now changes to "Locked" when clicked

//---------------------------------------------------------------------------

19-Nov-2019 Mike Knight

Work on live game simulation. We now calculate the 6 teams to catch the winning snitch and the times they catch them.

We the first snitch is caught the data is available live and the users score reflects if they got this prediciton live.

NOTE - ** The live total will include those scores but the web page does not display the information **

Once the live simulation is complete the users scores are saved along with the results to the database.

If a user locks in the scores the live game does not modify their scores in real time but does include the latest results.

NOTE - Work still needs to be done to not increment the live scores if the snitch is caught for that match. Also the snitch points
are not appended to the score either.

//---------------------------------------------------------------------------

20-Nov-2019 Sully Ahmed and Gemma;

Leaderboard page is now made, that sorts the table out by highest to lowest score. whether it is live or not the leaderboard can be viewed. Instead of bullet pointed list of the leaderboard, change needs to be made so it is a numbered pointed list.

vue file added for vue functionality that is associated with the leaderboard page.

DOM manipulation on live-beta page to display snitch team/time results and prediction

Snitch results now display on live page

Fixed bug where new game would appear at the end of live game instead of just displaying end results of current game.hoyeaah :P

To do: in apiRoutes, team prediction needs to display name rather than ID number

//---------------------------------------------------------------------------

20-Nov-2019 Mike Knight

Fixed issue where setting predictions was causing values to be storred as strings instead of numbers.

This was resolved by converting all data types to numbers, below is an example

    user.games[0].firstGoldenSnitchTeamPrediction = Number(formData.firstGoldenSnitchTeamPrediction);
    user.games[0].firstGoldenSnitchTimePrediction = Number(formData.firstGoldenSnitchTimePrediction);

//---------------------------------------------------------------------------

22-Nov-2019 Mike Knight

Initial Guide.txt added, passport dependencies removed from package.json

//---------------------------------------------------------------------------

22-Nov-2019 Ben Berhanu

Fixed an issue with the results page where the page will not load for new users without previous predictions. A condition to check if userPredictions are avaialable. If users havent submitted any predictions, the page will render the main page with a message letting them know predictions have not been submitted. 

Added "redirect" messages for the banners and used EJS conditional formatting to load messages when rendering the page. At the moment I have a message for score submission, registration and alerting users no scores have been submitted when visiting he results page.

NOTE: When redering the main page, you must include flashResults, flashScores and flashRegister with a value of 0 to hide the elements or 1 to show them

//---------------------------------------------------------------------------

22-Nov-2019 Ben Berhanu

Added a new viewRoute called "/logged-in". The login page used to redirect back to the index page using java script. The route renders the main ejs template with the added "flashLogged = 1" to show the welcome message. Not a great solution but the user will know they have been logged in. 

//---------------------------------------------------------------------------

22-Nov-2019 Ben Berhanu

Tiny css fixes to recentre banner

//---------------------------------------------------------------------------

24-Nov-2019 Mike Knight

Last tweaks and bug fixes

