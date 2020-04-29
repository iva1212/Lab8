const uuid = require('uuid');
const express = require('express');
const morgan = require( 'morgan' );
const bodyParcer = require('body-parser');
const validator = require('./middleware/validateToken');
const {Bookmarks} = require('./bookmarkModel');
const app = express();
const jsonParser = bodyParcer.json();
var mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(validator);
let listOfBookmarks=
[
    {   
        id:uuid.v4(),
        title: "BOOKMARK 1",
        description:"Bookmark to google",
        url:"www.google.com",
        rating : 90
    },
    {   
        id:uuid.v4(),
        title: "BOOKMARK 2",
        description:"Bookmark to twitter",
        url: "www.twitter.com",
        rating : 90
    },
    {   
        id:uuid.v4(),
        title: "BOOKMARK 3",
        description:"Bookmark to facebook",
        url : "www.facebook.com",
        rating : 90
    },
    {   
        id:uuid.v4(),
        title: "BOOKMARK 4",
        description:"Bookmark to instagram",
        url :"www.instagram.com",
        rating : 90
    },
    {   
        id:uuid.v4(),
        title: "BOOKMARK 1",
        description:"Bookmark to google",
        url:"www.google.com",
        rating : 83
    },
]

app.get('/bookmarks',(req,res)=>{
    Bookmarks.getAllBookmarks()
    .then(allBookmarks =>{
        return res.status(200).json(allBookmarks);
    })
    .catch(err =>{
        res.statusMessage = "Something went wrong with the DB,Try again Later.";
        return res.status(500).end();
    })
});
app.get('/bookmark',(req,res)=>{

    let title = req.query.title;

    if(!title){
        res.statusMessage = "Please send the title as parameter"
        return res.status(406).end();
    }
    let results = [];
    Bookmarks.getTitleBookmarks(title)
    .then(foundBookmarks=>{
        if(!foundBookmarks){
            res.statusMessage = "No bookmark found with the provided 'title'";
            return res.status(404).end();
        }
        else{
            return res.status(200).json(foundBookmarks);
        }
    })
    .catch(err =>{
        res.statusMessage = "Something went wrong with the DB,Try again Later.";
        return res.status(500).end();
    });
});

app.post('/bookmarks',jsonParser,(req,res)=>{
    console.log( "Body ", req.body );

    let id = uuid.v4();
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    if( !title || !description || !url || !rating){
        res.statusMessage = "One parameter is missing";

        return res.status( 406 ).end();
    }

    if( typeof(rating) !== 'number' ){
        res.statusMessage = "The 'rating' MUST be a number.";
        return res.status( 409 ).end();
    }

    let newBookmark = { id,title,description,url,rating };
    Bookmarks
    .createBookmark(newBookmark)
    .then(result =>{
        return res.status(201).json(result);
    })
    .catch(err =>{
        res.statusMessage = "Something went wrong with the DB,Try again Later.";
        return res.status(500).end();
    })
});
app.delete( '/bookmark/:id', ( req, res ) => {
    
    let id = req.params.id;

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status( 406 ).end();
    }

    Bookmarks.deleteIdBookmarks(id)
    .then(result =>{
        if(result.n === 0){
            res.statusMessage = "That 'id' was not found in the list of bookmarks.";
            return res.status( 400 ).end();
        }
        if(result.ok === 1){
            console.log(result);
            res.statusMessage = "The bookmark was erased";
            return res.status( 204 ).end();
        }
    })
    .catch(err =>{
        res.statusMessage = "Something went wrong with the DB,Try again Later.";
        return res.status(500).end();
    })
});

app.patch('/bookmark/:id',jsonParser,(req,res)=>{
    let idPath = req.params.id;
    if( !idPath ){
        res.statusMessage = "Please send the 'id' in the path to update a bookmark";
        return res.status( 406 ).end();
    }
    console.log( "Body ", req.body );
    let idBody = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!idBody){
        res.statusMessage = "Please send the 'id' in the body to update a bookmark";
        return res.status( 406 ).end();
    }
    if(idBody != idPath ){
        res.statusMessage = "Id's provided do not match "
        return res.status( 409 ).end();
    }

    Bookmarks.patchIdBookmarks(idBody,title,description,url,rating)
    .then(result =>{
        if(result){
            res.statusMessage = "Bookmark sucessfully updated";
            return res.status(202).end();
        }
        else{
            res.statusMessage = "No bokmark found with that Id"
            return res.status(404).end();
        }
    })
    .catch(err =>{
        res.statusMessage = "Something went wrong with the DB,Try again Later.";
        return res.status(500).end();
    })



});

app.listen(8080, () =>
{
    new Promise( (resolve,reject) =>{
        mongoose.connect('mongodb://localhost/bookmarksdb',{useNewUrlParser: true, useUnifiedTopology: true},(err) =>{
            if (err){
                reject(err);
            }
            else{
                console.log("database connected");
                return resolve();
            }
        });
    })
    .catch(err =>{
        mongoose.disconnect();
        console.log(err);
    })
    console.log("This server is using port 8080");
});


