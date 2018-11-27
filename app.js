var express             = require( 'express' ),
    app                 = express(),
    bodyParser          = require( 'body-parser' ),
    mongoose            = require( 'mongoose' ),
    Campground          = require( './models/campground' ),
    Comment             = require( './models/comment' ),
    seedDB              = require( './seeds' )
    passport            = require( 'passport' ),
    LocalStrategy       = require( 'passport-local' ),
    User                = require( './models/user' );
    methodOverride      = require( 'method-override' );
    flash               = require( 'connect-flash' );
    
    
var commentRoutes       = require( './routes/comments' ),
    campgroundRoutes    = require( './routes/campgrounds' ),
    indexRoutes         = require( './routes/index' );

    
mongoose.connect( 'mongodb://localhost/yelp_camp_v3' );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( methodOverride( '_method' ) );
app.set( 'view engine', 'ejs' );
app.use( express.static( __dirname + '/public' ) );
app.use( flash() );
// seedDB();

app.use( require( 'express-session' ) ( { 
    secret: "In the rays of the sun, I'm longing for the darkness",
    resave: false,
    saveUninitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new LocalStrategy( User.authenticate() ) );
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );

app.use( function( req, res, next ) { 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash( 'error' );
    res.locals.success = req.flash( 'success' );

    next();
} );

app.use( '/campgrounds/:id/comments', commentRoutes );
app.use( '/campgrounds', campgroundRoutes );
app.use( indexRoutes );


app.listen( 3000, function(){
   console.log( 'The YelpCamp Server Has Started!' );
} );