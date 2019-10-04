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

Changes to authenticate module - removed redirect login from module so it could be used for the rest api without a ridirect happening. The router now handles wat to do with unauthenticated requestes as theyt should be different between web pages and rest apis

Added stub functions for rgistering new users into the controller router and added client side form to invoke the rest api.
