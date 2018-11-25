var express         = require( 'express' );
var passport        = require( 'passport' );
var User            = require( '../models/user' );

var router          = express.Router( { mergeParams: true } );

router.get( '/', function( req, res ) {
    res.render( 'landing' );
} );

router.get( '/register', function( req, res ) { 
    res.render( 'register' );
} );

router.post( '/register', function( req, res ) {
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

router.get( '/login', function( req, res ) {
    res.render( 'login' );
} );

router.post( '/login', passport.authenticate( 'local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    } ), function( req, res ) { 
    } 
);

router.get( '/logout', function( req, res) { 
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

module.exports = router;