var Campground = require( '../models/campground' );
var Comment = require( '../models/comment' );


var middlewareObj = {};  

middlewareObj.checkCampgroundOwnership = function( req, res, next ) {
    if ( req.isAuthenticated() ) {
        Campground.findById( req.params.id, function( err, foundCampground ) {
            if ( err ) {
                req.flash( 'error', "Internal Server Error" );
                res.redirect( 'back' );
            } else {
                if ( foundCampground.author.id.equals( req.user._id ) ) {
                    next();
                } else {
                    req.flash( 'error', "Permission Denied" );
                    res.redirect( 'back' );
                }
            }
        } );
    } else {
        req.flash( 'error', "This action requires you to be logged in!" );
        res.redirect( 'back' )
    }
}

middlewareObj.checkCommentOwnership = function( req, res, next ) {
    if ( req.isAuthenticated() ) {
        Comment.findById( req.params.comment_id, function( err, foundComment ) {
            if ( err ) {
                req.flash( 'error', "Internal Server Error" );
                res.redirect( 'back' );
            } else {
                if ( foundComment.author.id.equals( req.user._id ) ) {
                    next();
                } else {
                    req.flash( 'error', "Permission Denied" );
                    res.redirect( 'back' );
                }
            }
        } );
    } else {
        req.flash( 'error', "This action requires you to be logged in!" );
        res.redirect( 'back' );
    }
}

middlewareObj.isLoggedIn = function( req, res, next ) {
    if( req.isAuthenticated() ) {
        return next();
    } else {
        req.flash( 'error', "This action requires you to be logged in!" );
        res.redirect( '/login' );
    }
}

module.exports = middlewareObj;