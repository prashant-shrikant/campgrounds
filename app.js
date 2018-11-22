var express         = require( 'express' ),
    app             = express(),
    bodyParser      = require( 'body-parser' ),
    mongoose        = require( 'mongoose' ),
    Campground      = require( './models/campground' ),
    Comment         = require( './models/comment' ),
    seedDB          = require( './seeds' )
    passport        = require( 'passport' );
    LocalStrategy   = require( 'passport-local' );
    User            = require( './models/user' );
    
mongoose.connect( 'mongodb://localhost/yelp_camp_v3' );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.set( 'view engine', 'ejs' );
app.use( express.static( __dirname + '/public' ) );
seedDB();

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
    next();
} );

app.get( '/', function( req, res ) {
    res.render( 'landing' );
} );

// INDEX - show all campgrounds
app.get( '/campgrounds', function( req, res ) {
    // Get all campgrounds from DB
    Campground.find( {}, function( err, allCampgrounds ) {
       if( err ) {
            console.log( err );
       } else {
            res.render( 'campgrounds/index', { campgrounds: allCampgrounds } );
       }
    } );
} );

// CREATE - add new campground to DB
app.post( '/campgrounds', function( req, res ){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc }
    // Create a new campground and save to DB
    Campground.create( newCampground, function( err, newlyCreated ){
        if( err ){
            console.log( err );
        } else {
            //redirect back to campgrounds page
            res.redirect( '/campgrounds' );
        }
    } );
} );

// NEW - show form to create new campground
app.get( '/campgrounds/new', function( req, res ) {
   res.render( 'campgrounds/new' ); 
} );

// SHOW - shows more info about one campground
app.get( '/campgrounds/:id', function( req, res ) {
    //find the campground with provided ID
    Campground.findById( req.params.id ).populate( 'comments' ).exec( function( err, foundCampground ) {
        if( err ) {
            console.log( err );
        } else {
            console.log( foundCampground )
            //render show template with that campground
            res.render( 'campgrounds/show', { campground: foundCampground } );
        }
    } );
} );

// NEW COMMENTS
app.get( '/campgrounds/:id/comments/:new', isLoggedIn, function( req, res ) {
    Campground.findById( req.params.id, function( err, foundCampground ) { 
        console.log( foundCampground );
        if ( err ) {
            console.log( err );
        } else {
            res.render( 'comments/new', { campground: foundCampground } );
        }
    } ); 
} );

app.post( '/campgrounds/:id/comments', isLoggedIn, function( req, res ) { 
    Campground.findById( req.params.id, function (err, foundCampground ) { 
        if ( err ) {
            console.log( err );
            res.redirect( '/campgrounds' );
        } else {
            console.log( req.body.comment );
            Comment.create(req.body.comment, function( err, comment ) { 
                if ( err ) {
                    console.log( err );
                } else {
                    foundCampground.comments.push( comment );
                    foundCampground.save();
                    res.redirect( '/campgrounds/' + foundCampground._id );
                }
            } );
        }
    } );
} );

app.get( '/register', function( req, res ) { 
    res.render( 'register' );
} );

app.post( '/register', function( req, res ) {
    console.log( req.body );
    newUser = new User( { username: req.body.username} );
    newPassword = req.body.password;
    User.register( newUser, newPassword, function( err, user ) { 
        if ( err ) {
            console.log( err );
            return res.render( 'register' );
        } 
        passport.authenticate( 'local' )(req, res, function() { 
            res.redirect( '/campgrounds' );
        } );
    } );
} );

app.get( '/login', function( req, res ) {
    res.render( 'login' );
} );

app.post( '/login', passport.authenticate( 'local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    } ), function( req, res ) { 
    } 
);

app.get( '/logout', function( req, res) { 
    req.logout();
    res.redirect( '/campgrounds' );
} );

function isLoggedIn( req, res, next ) {
    if( req.isAuthenticated() ) {
        return next();
    } else {
        res.redirect( '/login' );
    }
 }

app.listen( 3000, function(){
   console.log( 'The YelpCamp Server Has Started!' );
} );