# WebsiteAssignmentMSC2019

//---------------------------------------------------------------------------

01-Oct-2019 - Mike Knight

I have added an authenticate module with the following API’s

-	Login

The router maps /login to this api and the username and password is parsed from the query string (may want to change that?) and reruns a jwt token in a cookie. It is set as a cookie rather than a bearer token in the header because it is very difficult to intercept href calls client side. However, cookies are automatically transmitted hence the decision to go with that mechanism.

-	Authenticate 

The router can use this API to authenticate access to restricted resources. For now, I have set this to anything in the new user directory I have created. I have moved the betting page into this directory which means you now need to be logged in to see that page. If you are not authenticated it redirects the client to the login screen.

** Client-side changes

I have added a basic login screen and some client-side java script to call the server login API when you click the login button. It then redirects you to the index page. The session currently only lives for 30 seconds before it expires this is just to allow us to easily see and test that expiry logic for now. 

**** The username and password for logging in is bob and pass. This is currently hardcoded and needs to come from a database instead. I wanted to keep it really simple for now and once everyone understands someone else can maybe use the controller to grab and validate the user properly.


** Controller module started


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

To do: I will also convert the login page to ejs 