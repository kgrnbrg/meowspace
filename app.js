// Requirements
var express = require("express"),
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
Twitter = require('twitter'),
Twit = require('twit'),
fs = require('fs'),
favicon = require('serve-favicon');
var port = process.env.PORT || 3000;

//Settings
var app = express();
app.set("views", __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/media/favicon.ico'));
app.use(bodyParser.json());
app.use(errorHandler());
var server = app.listen(port);
console.log('Express started on port ' + port);

//Do not share
var TWITTER_CONSUMER_KEY = '';
var TWITTER_CONSUMER_SECRET = '';
var TWITTER_ACCESS_TOKEN_KEY = '';
var TWITTER_ACCESS_SECRET = '';

var client = new Twitter({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token_key: TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: TWITTER_ACCESS_SECRET
});


var params = {
	user_id: '773006130121355264'//required for latest post
};

//ROUTES
app.get("/", function(req, res){
	res.render('index');
});

/*-----Here we post get the latest post-----*/
app.get("/search", function(req, res){
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (error){
			throw error;
		}
		console.log(tweets[0]);
		var theTweet = {'tweet': tweets[0]};
		res.json(theTweet);
	});
});

/*-----Here we post gifs-----*/

app.post("/save", function(req, res){
	console.log("Saving...");
	var T = new Twit({
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET,
		access_token: TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: TWITTER_ACCESS_SECRET
	});
	var b64content = fs.readFileSync('./giffo.gif', { encoding: 'base64' })
// post media on twitter
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
// reference media and post a tweet
		var mediaIdStr = data.media_id_string
		var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
		T.post('statuses/update', params, function (err, data, response) {
			console.log(data)
		})
	})
});


app.get("*", function(req,res){
	res.redirect("/");
});