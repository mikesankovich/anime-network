var app = angular.module('Anime', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', { url: '/', templateUrl: 'views/home.ejs', controller: 'mainCtrl' })
  .state('login', { url: '/login', templateUrl: 'views/login.ejs', controller: 'mainCtrl' })
  .state('login2', { url: '/loginerror', templateUrl: 'views/login2.ejs', controller: 'mainCtrl' })
  .state('register', { url: '/register', templateUrl: 'views/register.ejs', controller: 'registerCtrl' })
  .state('anime', { url: '/anime/{animename}', templateUrl: 'views/anime.ejs', controller: 'animeCtrl' })
  .state('animegenre', { url: '/animegenre', templateUrl: 'views/animeGenre.ejs', controller: 'genreCtrl' });
}]);
