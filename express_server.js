const express = require("express");
const app = express();
//var appJS = require("./app");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set("view engine", "ejs");

var PORT = process.env.PORT || 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "h79d3d": "http://skeptikai.com"
};

var usersDatabase = {
  "userRandomID": {id: "userRandomID", email: "user@example.com", password: "nonsense-password"},
    "user2RandomID": {id: "user2RandomID", email: "user2@example.com", password: "other-password"},
}

app.get("/", (req, res) => {  // root route
  // res.clearCookie('user_id')
  var user_id = req.cookies["user_id"];
  console.log('test', user_id)

  var data = {urls: urlDatabase, email: ''};

  if(user_id){
    data['email'] = usersDatabase[user_id].email
  }

  var templateVars = makeTemplateVars(req, data);
  res.render('urls_index', templateVars);
});

app.get("/urls", (req, res) => {  // this needs to show data from urlDatabase
  console.log( "NOTICE MEEEEEEEEE... I'm from the /urls file!" + urlDatabase);
//function which returns an empty object; (& object merge)

  var templateVars = makeTemplateVars(req, {
    urls: urlDatabase
  });

  res.render("urls_index", templateVars);
});



//****************** Time pending: delete & re-create *****************
app.get("/urls/new", (req, res) => { // to enter a new URL to be shortened
  var user_id = req.cookies["user_id"]

  var data = {urls: urlDatabase, email: ''};

  if(user_id){
    data['email'] = usersDatabase[user_id].email
  }

  var templateVars = makeTemplateVars(req, data);
  res.render("urls_new", templateVars);

});

//****************** Time pending: delete & re-create *****************
app.post("/urls/:shortURL/update", (req, res) => {
  console.log(req.body);
  console.log(req.params.shortURL);
  // res.send("This is a SEND response");
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls");
});

//DUPLICATE CHANGES TO TEMPLATEVARS ........ FUNCTION & STUFF~~~~~~~~

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = makeTemplateVars(req, {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  });
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {           //"params" is short for "query parameters"
  let longURL = urlDatabase[req.params.shortURL]; //req.params accesses variables in the URL path
  res.redirect(longURL); //the variable name (shortURL) has to match the variable string (:shortURL) in the path
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { // hello route
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/");
});

//****************** Time pending: delete & re-create *****************
app.post("/urls/create", (req, res) => {
  console.log(generateRandomString());
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect("/");
});


app.post("/register", (req, res) => {

  var email = req.body.email;
  var password = req.body.password;
  var user_id = generateRandomString();


  var emailExists = false;

  for (user in usersDatabase){
    if(usersDatabase[user].email === email){
      emailExists = true;
    }
  }

  // return 404 if usersDatabase has the user_id in it
  // or if email and/or password have no value
  if(emailExists || !email || !password){

    res.status(404).send('Not found');

  } else {

      usersDatabase[user_id] = {id: user_id, email: email, password: password};
      console.log('all the things!' ,usersDatabase)
      res.cookie('user_id', user_id);
      res.redirect("/");
  }


});


app.get("/login", (req, res) => {


  res.render("login");
});

app.post("/login", (req, res) => {


  var email = req.body.email;
  var password = req.body.password;

  var currentUser = '';
  // tests if the username and password combination exists
  // if it does, set the value of currentUser
  for (user in usersDatabase){
    if(usersDatabase[user].email === email && usersDatabase[user].password === password){
      currentUser = user;
    }
  }

  if(currentUser){
      res.cookie("user_id", currentUser);
      res.redirect("/");
  } else {
     res.sendStatus(403);
  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  //not sure if this may help...
      // req.logout();
      // req.session.destroy(function (err) {
      //         res.redirect('/');
      //     });
  // res.end("Logged out");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  var randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++ ){
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomString;
}

function makeTemplateVars(req, o) {
  return Object.assign({user_id: req.cookies["user_id"]}, o);
}
