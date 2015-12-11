var app=angular.module("Anime",["ui.router"]);app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("/",{url:"/",templateUrl:"views/home.ejs",controller:"mainCtrl"}).state("login",{url:"/login",templateUrl:"views/login.ejs",controller:"mainCtrl"}).state("login2",{url:"/loginerror",templateUrl:"views/login2.ejs",controller:"mainCtrl"}).state("register",{url:"/register",templateUrl:"views/register.ejs",controller:"registerCtrl"}).state("profile",{url:"/profile",templateUrl:"views/profile.ejs",controller:"profileCtrl"}).state("anime",{url:"/anime/{animename}",templateUrl:"views/anime.ejs",controller:"animeCtrl"}).state("animelist",{url:"/animelist/{animename}",templateUrl:"views/animeGenre.ejs",controller:"animeListCtrl"}).state("animegenre",{url:"/animegenre",templateUrl:"views/animeGenre.ejs",controller:"genreCtrl"})}]),app.controller("animeCtrl",function($scope,$state,$http,animeService){$scope.whichUrl="http://localhost:4000",animeService.getOneAnime().success(function(anime){$scope.anime=anime}),$scope.genres=function(){console.log("es"),$http.get($scope.whichUrl+"/genres").success(function(episodes){console.log(episodes)})},$scope.favoriteThis=function(show){console.log(show)}}),app.controller("animeListCtrl",function($scope,$state,$http,$rootScope,animeService){animeService.getCurrentAnime().success(function(anime){1===anime.length?(console.log("hello"),$state.go("anime",{animename:$state.params.animename})):($scope.anime=anime,console.log($scope.anime))}),$scope.toShow=animeService.showOneAnime}),app.controller("autoCtrl",function($scope,$state,$http,$rootScope,$location,userService){$(document).ready(function(){function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments,later=function(){timeout=null,immediate||func.apply(context,args)},callNow=immediate&&!timeout;clearTimeout(timeout),timeout=setTimeout(later,wait),callNow&&func.apply(context,args)}}$scope.whichUrl="http://localhost:4000",$scope.hideGenre=!1;var availableTags=[];userService.getCurrentUser().success(function(data){$rootScope.currentUser=data}),$("input").keyup(debounce(function(){$scope.n=$(".autocomplete").val(),$http.post($scope.whichUrl+"/anime/"+$scope.n).success(function(anime){anime.forEach(function(e){void 0!==e.title&&-1===availableTags.indexOf(e.title)&&availableTags.push(e.title)})})},200)),$("#tags").autocomplete({source:availableTags,select:function(event,ui){$(this).val(ui.item.value),$scope.anime=$(this).val()}}),$scope.searchAnime=function(){anime=document.getElementById("tags").value,$state.go("animelist",{animename:anime}),document.getElementById("tags").value=""},$(function(){var max=4,checkboxes=$('input[type="checkbox"]');checkboxes.change(function(){var current=checkboxes.filter(":checked").length;checkboxes.filter(":not(:checked)").prop("disabled",current>=max)})}),$scope.genres=function(genre){$rootScope.searchGenres=[];for(var key in genre)genre[key]===!0&&("GenderBender"===key?$rootScope.searchGenres.push("Gender Bender"):"MahouShoujo"===key?$rootScope.searchGenres.push("Mahou Shoujo"):"MartialArts"===key?$rootScope.searchGenres.push("Martial Arts"):"SciFi"===key?$rootScope.searchGenres.push("Sci-Fi"):"ShounenAi"===key?$rootScope.searchGenres.push("Shounen Ai"):"MahouShounen"===key?$rootScope.searchGenres.push("Mahou Shounen"):"ShoujoAi"===key?$rootScope.searchGenres.push("Shoujo Ai"):"SliceofLife"===key?$rootScope.searchGenres.push("Slice of Life"):"SuperPower"===key?$rootScope.searchGenres.push("Super Power"):$rootScope.searchGenres.push(key));$("#myModal").foundation("reveal","close"),"/animegenre"!==$location.$$path?$state.go("animegenre"):$state.go($state.current,{},{reload:!0})}})}),app.controller("genreCtrl",function($scope,$state,$http,$rootScope,animeService){$scope.whichUrl="http://localhost:4000",$scope.search=$rootScope.searchGenres,$http.post($scope.whichUrl+"/genres",$scope.search).success(function(anime){$scope.anime=anime,console.log(anime),$rootScope.searchGenres=[]}),$scope.toShow=animeService.showOneAnime}),app.controller("mainCtrl",function($scope,$state,$http,$rootScope,animeService){$scope.results1=[],$scope.whichUrl="http://localhost:4000";var init=function(){console.log("i fired"),animeService.getRandAnime().success(function(randAnime){$rootScope.frontAnime=randAnime}).error(function(err){console.log(err)})};init(),$scope.toShow=animeService.showOneRandAnime,$scope.register=function(newUser){$scope.newUser=newUser,$http.post($scope.whichUrl+"/register",$scope.newUser).success(function(err,data){return err.hasOwnProperty("name")===!0?void sweetAlert("Uh Oh  ",err.message,"error"):err.hasOwnProperty("errmsg")?void sweetAlert("Uh Oh ",newUser.email+" is already registered","error"):($scope.user=$scope.newUser,void $state.go("/").then(function(){location.reload()}))})}}),app.controller("profileCtrl",function($scope,$state,$http,$rootScope,userService){userService.getCurrentUser().success(function(data){$scope.user=data})}),app.controller("registerCtrl",function($scope,$state,$http){$scope.whichUrl="http://localhost:4000",$scope.register=function(newUser){$scope.newUser=newUser,$http.post($scope.whichUrl+"/register",$scope.newUser).success(function(err,data){return err.hasOwnProperty("name")===!0?void sweetAlert("Uh Oh  ",err.message,"error"):err.hasOwnProperty("errmsg")?(console.log(err),void sweetAlert("Uh Oh ",newUser.email+" is already registered","error")):($scope.user=$scope.newUser,void $state.go("/").then(function(){location.reload()}))})}}),app.service("animeService",function($http,$state){var whichUrl="http://localhost:4000";this.getCurrentAnime=function(){return $http.post(whichUrl+"/animelist/"+$state.params.animename).success(function(anime){return anime})},this.getOneAnime=function(){return $http.get(whichUrl+"/animesearch/"+$state.params.animename).success(function(anime){return console.log(anime),anime})},this.getRandAnime=function(){return $http.post(whichUrl+"/").success(function(randAnime){return randAnime})},this.showOneAnime=function(){console.log(this.a.title),$state.go("anime",{animename:this.a.title})},this.showOneRandAnime=function(){$state.go("anime",{animename:this.rand.title})}}),app.service("userService",function($http){var whichUrl="http://localhost:4000";this.getCurrentUser=function(){return $http.get(whichUrl+"/user").success(function(user){return user?user:void 0})}});