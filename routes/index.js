var express = require('express');
var router = express.Router();
var passport = require('passport');
var logout = require('express-passport-logout');
var User = require('../models/user');
var Anime = require('../models/anime');
var Forum = require('../models/forum');
var Review = require('../models/review');
var Topic = require('../models/topic');
var Post = require('../models/post');
var Post = require('../models/message');
var unirest = require('unirest');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
  res.send();
});
router.get('/allloggedin', function(req, res, next) {
  console.log('yes')
  var currentUserList = []
  User.find({isLoggedIn: true}, function(err, users) {
    users.forEach(function(e) {
      console.log(e.username)
      var name = e.username
      var _id = e._id
      currentUserList.push({name: name, _id: _id})
      console.log("this", currentUserList)
    })
    res.send(currentUserList)
  })
});
router.post('/', function(req, res) {
  var randAnime = [];
  for(var i = 0; i < 6; i++) {
    var genres = [];
    Anime.random(function(err, anime) {
      anime.genres.forEach(function(e) {
        genres.push(e.name);
      });
      if(randAnime.indexOf(anime) === -1 && genres.indexOf("Hentai") === -1 && anime.rating !== "R18+") {
        randAnime.push(anime);
        i++;
        if(randAnime.length === 6) {
          res.send(randAnime);
        }
      }
    });
  }
});

router.get('/myanimelists/:id', function(req, res) {
  Anime.findById(req.params.id, function(err, anime) {
    if(err) {res.send(err)}
    else {
      res.send(anime)
    }
  })
})

router.post('/anime/:id', function(req, res) {
  var y = req.params.id.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  Anime.find({title: {$regex: y}}, function(err, anime) {
    if(err) {res.send(err);}
    res.send(anime);
  });
});
router.post('/animelist/:id', function(req, res) {
  var y = req.params.id.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  Anime.find({title: { $regex: new RegExp("^" + y, "i") }}, function(err, anime) {
    if(err) {res.send(err);}
    res.send(anime);
  });
});

router.get('/animesearch/:id', function(req, res) {
  var x = req.params.id.split("%20").join(" ");
  var y = x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  Anime.find({title: y}, function(err, anime) {
    if(err) { res.send(err); }
    if(anime.length === 0) {
      Anime.find({title: { $regex: new RegExp("^" + y, "i") }}, function(err, anime) {
        if(err) { res.send(err); }
        res.send(anime[0]);
      });
    }
    else {
      if(err) { res.send(err); }
      res.send(anime[0]);
    }
  });
});
router.post('/genres', function(req, res) {
  var x = req.body;
  if(x.length === 1) {
    Anime.find( {genres: {$elemMatch: {name:req.body[0]}}}, function(err, anime) {
      if(err) { res.send(err); }
      res.send(anime);
    });
  }
  if(x.length === 2) { Anime.find( {$and: [
    {genres: {$elemMatch: {name:req.body[0]}}},
    {genres: {$elemMatch: {name:req.body[1]}}},
  ]}, function(err, anime) {
    if(err) { res.send(err); }
    res.send(anime); });
  }
  if(x.length === 3) { Anime.find({$and: [
    {genres: {$elemMatch: {name:req.body[0]}}},
    {genres: {$elemMatch: {name:req.body[1]}}},
    {genres: {$elemMatch: {name:req.body[2]}}},
  ]}, function(err, anime) {
    if(err) { res.send(err); }
    res.send(anime); });
  }
  if(x.length === 4) { Anime.find( {$and: [
    {genres: {$elemMatch: {name:req.body[0]}}},
    {genres: {$elemMatch: {name:req.body[1]}}},
    {genres: {$elemMatch: {name:req.body[2]}}},
    {genres: {$elemMatch: {name:req.body[3]}}},
  ]}, function(err, anime) {
    if(err) { res.send(err); }
    res.send(anime); });
  }
});

router.post('/addReview/:id', function(req, res) {
  Anime.findByIdAndUpdate(req.params.id, {$push: {reviews:
    {
      title: req.body.title,
      user: req.user._id,
      body: req.body.body,
      rating: req.body.rating
    }}}, function(err, anime) {
      User.findByIdAndUpdate(req.user._id, {$push: {reviews:
        {
          title: req.body.title,
          show: req.params._id,
          body: req.body.body,
          rating: req.body.rating
        }}}, function(err, user) {
          res.send(anime);
        });
      });
    });
    //
    // router.get('/animeget/:id', function(req, res) {  //for getting from api
    //   console.log("req.body", req.params.id);
    //   unirest.get("https://hummingbirdv1.p.mashape.com/anime/" + req.params.id)
    //   .header("X-Mashape-Key", "fL30UnxVmgmsh80IDMvD28obwFSup1Fv6mNjsnjhuV3M9VbB2R")
    //   .header("Accept", "application/json")
    //   .end(function (result) {
    //     console.log(result)
    //     // result.body.usersCompleted = [];
    //     // result.body.usersWatching = [];
    //     // result.body.favorites = [];
    //     // result.body.reviews = [];
    //     // result.body.ratings = [];
    //     // result.body.questions = [];
    //     // console.log('Bodydajgsdlgjsdlgj', result.body);
    //     // Anime.create(result.body, function(err, anime) {
    //     //   console.log('asdfasdfasdf', err);
    //     //   console.log("animeasdfsadfasd", anime);
    //     //   res.send();
    //     // });
    //   });
    // });
    // router.get('/makeforum', function(req, res) {
    //   Anime.find({}, function(err, animes) {
    //     animes.forEach(function(e) {
    //       Forum.create({
    //         showId: e._id, //===shows mongoId
    //         slug: e.slug,  //shows slug------
    //         title: e.title,  //shows title----these two are needed for forum search.(no need to go to show's page first)
    //         topics: []
    //       }, function(err, anime) {
    //         console.log('asdfasdfasdf', err);
    //         console.log("animeasdfsadfasd", anime);
    //       });
    //     })
    //     res.send();
    //   })
    // })

    router.post('/animereview/:id', function(req, res) {
      Review.create({
        showId: req.body.show,//===shows mongoId
        title: req.body.title,
        user: req.body.user,
        body: req.body.body,
        userRating: req.body.userRating
      }, function(err, review) {
        Anime.findById(req.params.id, function(err, anime) {
          anime.reviews.push(review._id)
          anime.ratings.push({rating:review.userRating, user: req.body.user})
          anime.save();
          User.findById(req.user._id, function(err, user) {
            user.reviews.push(review._id)
            user.save()
            res.send(anime);
          });
        });
      });
    });
    router.get('/reviews/:id', function(req, res) {
      Review.find({showId: req.params.id}, function(err, reviews) {
        res.send(reviews)
      })
    })

    router.post('/ratings', function(req, res) {
      Anime.findById(req.body.anime, function(err, anime) {
        anime.ratings.push({rating: req.body.rating, user: req.user.id})
        anime.save();
        res.send(anime)
      });
    })
    router.get('/showforum/:id', function(req, res) {
      Forum.findOne({showId: req.params.id}, function(err, forum) {
        console.log(forum)
        res.send(forum)
      })
    })
    router.get('/topics/:id', function(req, res) {
      Topic.find({forumId: req.params.id}, function(err, topics) {
        res.send(topics)
      })
    })
    router.get('/onetopic/:id', function(req, res) {
      Topic.find({_id: req.params.id}, function(err, topic) {
        res.send(topic)
      })
    })
    router.post('/respondtopic', function(req, res) {
      Topic.findById(req.body._id, function(err, topic) {
        topic.responses = req.body.responses
        topic.mostRecentUser = req.user.id
        topic.save()
        res.send(topic)
      })
    })
    router.post('/newtopic', function(req, res) {
      Topic.create(req.body, function(err, topic) {
        Forum.findById(topic.forumId, function(err, forum) {
          forum.topics.push(topic.id)
          forum.save()
          User.findById(req.user.id, function(err, user) {
            user.myTopics.push(topic.id)
            user.save()
            res.send(topic)
          })
        })
      })
    })

    router.post('/newmessage', function(req, res) {
      User.findById(req.body.to, function(err, user1) {
        user1.friendIds.forEach(function(e) {
          if(e.friendId === req.body.from) {
            e.messages.push(req.body)
            user1.save()
          }
        })
      })
      User.findById(req.body.from, function(err, user2) {
        user2.friendIds.forEach(function(f) {
          if(f.friendId === req.body.to) {
            f.messages.push(req.body)
            user2.save()
          }
        })
      })
      res.send("success")
    })

  router.post('/updateuser', function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
      if (err) { res.send(err);}
      else {
        user.watchingAnime = req.body.watchingAnime;
        user.save()
        res.json(user);
      }
    });
  });

  var logout = function(req, res){
    if (req.isAuthenticated()){
      User.findById(req.user.id, function(err, user) {
        user.isLoggedIn = false
        user.save()
        req.logout();
        res.redirect('/');
      })
    }
  };
  router.get('/logout', logout);

  module.exports = router;
