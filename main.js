const express = require("express");
const app = express();
const cookie = require("cookie");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function html(code){
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${code}
</body>
</html>`
}

function login(req, res){
  var owner = false;
  var cookies = {};
  if(req.headers.cookie){
    cookies = cookie.parse(req.headers.cookie);
  }
  if(cookies.name == "hello" && cookies.password == 1234){
    owner = true;
  }
  return owner;
}

app.get("/", function(req, res){
  var isOwner = login(req, res);
  if(isOwner){
    res.send(html(`<a href="/logout">logout</a><br><a href="/create">create</a>`))
  }
  else{
    res.send(html(`<a href="/login">login</a><br><a href="/create">create</a>`));
  }
})

app.get("/login", function(req, res){
  res.send(html(`<form action="/login_process" method="post">
    <p><input type="text" name="name" placeholder="Name"></p>
    <p><input type="password" name="password" placeholder="Password"></p>
    <input type="submit" value="제출">
  </form>`))
})

app.post("/login_process", function(req, res){
  var post = req.body;
  if(post.name == "hello" && post.password == 1234){
    res.writeHead(302, {
      "set-cookie": [
        `name=${post.name}`,
        `password=${post.password}`
      ], location: "/"
    })
    res.end();
  }
  else{
    res.end("who");
  }
})

app.get("/logout", function(req, res){
  res.writeHead(302, {
    "set-cookie": [
      `name=; max-age=0`,
      `password=; max-age=0`
    ],
    location: "/"
  })
  res.end();
})

app.get("/create", function(req, res){
  res.send(html(`<form action="/create_process" method="post">
    <p><input type="text" name="title" placeholder="Title"></p>
    <input type="submit" value="제출">
  </form>`))
})

app.post("/create_process", function(req, res){
  if(login(req, res) == false){
    res.writeHead(302, {location: "/login"});
    res.end();
  }
})

app.listen(3000, function(){
  console.log("Start");
})