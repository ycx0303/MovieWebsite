var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3300
var app = express()

// mongoose.connect('mongodb://localhost/imooc', { useMongoClient: true })
mongoose.connect('mongodb://127.0.0.1:27017/movie-website', { useMongoClient: true })
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function() {
console.log('Mongodb started !')
})

//设置视图根目录
app.set('views', './views/pages')
//设置默认模板引擎
app.set('view engine', 'jade')
// app.use(express.bodyParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'bower_components')))
app.listen(port)

console.log('movieWeb started on port ' + port)

//index page
app.get('/', function(req, res) {
	// console.log('user in session:'+req.session.user);
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('index', {
			title: '视频首页',
			movies: movies
		})
	})
})

//detail page
app.get('/movie/:id', function (req, res) {
  var id = req.params.id

  Movie.findById(id, function (err, movie) {
    res.render('detail', {
      title: 'movieWeb 详情页',
      movie: movie
    })
  })
})

//admin page
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: 'movieWeb 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

//admin update movie
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: 'movieWeb 后台更新页',
        movie: movie
      })
    })
  }
})

//admin post movie
app.post('./admin/movie/new', function (req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  if (id !== 'undefinded') {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie.id)
      })
    })
  }
  else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function (err, movie) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movie.id)
    })
  }
})

//list page
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: 'movieWeb 列表页',
      movies: movies
    })
  })
})