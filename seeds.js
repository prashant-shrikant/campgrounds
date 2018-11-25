var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment   = require('./models/comment');

var data = [
    {
        name: "Savandurga", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        name: "Makalidurga", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        name: "Antharagange",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    }
];

function seedDB() {
   //Remove all campgrounds
   Campground.remove( {}, function( err ) {
        if( err ) {
            console.log( err );
        }
        console.log( "removed campgrounds!" );
         //add a few campgrounds
        // data.forEach( function( seed ) {
        //     Campground.create( seed, function( err, campground ) {
        //         if( err ) {
        //             console.log( err );
        //         } else {
        //             console.log( "Added a campground: " + campground._id );
        //             //create a comment
        //             Comment.create(
        //                 {
        //                     text: "This place is great! But too rocky for a dog to climb!",
        //                     author: "Prashant Shrikant"
        //                 }, function( err, comment ){
        //                     if( err ){
        //                         console.log( err );
        //                     } else {
        //                         campground.comments.push( comment );
        //                         campground.save();
        //                         console.log( "Created new comment: " + comment._id);
        //                     }
        //                 } );
        //         }
        //     } );
        // } );
    } ); 
    //add a few comments
}

module.exports = seedDB;
