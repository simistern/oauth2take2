
var app = angular.module("oauth2", []);
app.controller("controller", function($scope, $http, $location){
  $scope.signup = {
    "clientId":"",
    "clientSecret":"",
    "grantType": "customer",
    "passcode":""
  }
  $scope.login = {
    "clientId": "",
    "clientSecret":"",
    "grantType": "customer"
  }

  $scope.signupEvent = function() {
    $http({
      "method": "POST",
      "url": "/register",
      "data": $scope.signup
    }).then(function(res){
      $scope.signup = {
        "clientId" : "",
        "clientSecret" : "",
        "grantType": "customer",
        "passcode":""
      }
      alert("User signed up!");
    }, function(err){
      alert("There was an error!");
    })
  }

  $scope.loginEvent = function(){
    $http({
      "method": "POST",
      "url": "/login",
      "data":{
        "client": $scope.login
      }
    }).then(function(res){
      window.location.assign("/ticketpage.html");
      //alert("user Logged in!");
      $scope.accessToken = res.data.accessToken;
    }, function(err){
      alert("Please try again");
    })
  }
})

/*$http({
  url: "/restricted",
  headers: {
    "Authorization": [ACCESS TOKEN HERE]
  }
})*/
