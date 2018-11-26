var express         = require( 'express' );
var Campground      = require( '../models/campground' );
var Comment         = require( '../models/comment' );

var router          = express.Router( { mergeParams: true } );

// NEW COMMENTS
router.get( '/:new', isLoggedIn, function( req, res ) {
    Campground.findById( req.params.id, function( err, foundCampground ) { 
        console.log( foundCampground );
        if ( err ) {
            console.log( err );
        } else {
            res.render( 'comments/new', { campground: foundCampground } );
        }
    } ); 
} );

router.post( '/', isLoggedIn, function( req, res ) { 
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push( comment );
                    foundCampground.save();

                    res.redirect( '/campgrounds/' + foundCampground._id );
                }
            } );
        }
    } );
} );

function isLoggedIn( req, res, next ) {
    if( req.isAuthenticated() ) {
        return next();
    } else {
        res.redirect( '/login' );
    }
}

module.exports = router;