function generateRandomString() {

  var randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++ ){
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomString;
}

console.log(generateRandomString());
