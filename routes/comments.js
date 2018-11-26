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

router.get( '/:comment_id/edit', checkCommentOwnership, function( req, res ) { 
    Comment.findById( req.params.comment_id, function( err, foundComment ) { 
        if ( err ) {
            res.send( 'back' );
        } else {
            res.render( 'comments/edit', { campground_id: req.params.id, comment: foundComment } )
        }
    } );
} );

router.put( '/:comment_id', checkCommentOwnership, function( req, res ) { 
    Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment, function( err, updatedComments ) {
        if ( err ) {
            res.redirect( 'back' );
        } else {
            res.redirect( '/campgrounds/' + req.params.id );
        }
    } ); 
} );

router.delete( '/:comment_id', checkCommentOwnership, function( req, res ) { 
    Comment.findByIdAndRemove( req.params.comment_id, function( err ) {
        if ( err ) {
            res.redirect( 'back' );
        } else {
            res.redirect( 'back' );
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

function checkCommentOwnership( req, res, next ) {
    if ( req.isAuthenticated() ) {
        console.log( "is authenticated " + req.isAuthenticated() );
        Comment.findById( req.params.comment_id, function( err, foundComment ) {
            if ( err ) {
                res.redirect( 'back' );
            } else {
                if ( req.isAuthenticated && foundComment.author.id.equals( req.user._id ) ) {
                    next();
                } else {
                    res.redirect( 'back' );
                }
            }
        } );
    } else {
        res.redirect( 'back' );
    }
}

module.exports = router;