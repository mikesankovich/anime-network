var app=angular.module("Anime",["ui.router"]);app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("/",{url:"/",templateUrl:"views/home.ejs",controller:"mainCtrl"}).state("login",{url:"/login",templateUrl:"views/login.ejs",controller:"mainCtrl"}).state("login2",{url:"/login2",templateUrl:"views/login2.ejs",controller:"mainCtrl"}).state("register",{url:"/register",templateUrl:"views/register.ejs",controller:"mainCtrl"})}]),app.controller("mainCtrl",function($scope,$state,$http){$http.get("http://localhost:3000/user").success(function(user){user&&(console.log("user",user),$scope.currentUser=user.username)}),$scope.register=function(newUser){$scope.newUser=newUser,$http.post("http://localhost:3000/register",$scope.newUser).success(function(err,data){return err.hasOwnProperty("name")===!0?void sweetAlert("Uh Oh ",err.message,"error"):err.hasOwnProperty("errmsg")?(console.log(err),void sweetAlert("Uh Oh ",newUser.email+" is already registered","error")):($scope.user=$scope.newUser,void $state.go("/").then(function(){location.reload()}))})}});