var mongoose = require('mongoose');


const bookmarksCollectionSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique: true
    },
    title : {
        type: String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    },
    url : {
        type: String,
        required : true,
    },
    rating : {
        type: Number,
        required : true,
    },
});

const bookmarksCollection = mongoose.model('bookmarks',bookmarksCollectionSchema);

const Bookmarks = {
    createBookmark : function(newBookmark){
        return bookmarksCollection.create(newBookmark)
        .then ( createdBookmark =>{
            return createdBookmark
        })
        .catch(err =>{
            return err;
        });
    },
    getAllBookmarks: function(){
        return bookmarksCollection
        .find()
        .then(allBookmarks =>{
            return allBookmarks
        })
        .catch(err =>{
            return err;
        });
    },
    getTitleBookmarks: function( query){
        return bookmarksCollection
        .find({title : query})
        .then(allBookmarks =>{
            return allBookmarks
        })
        .catch(err =>{
            return err;
        });
    },
    deleteIdBookmarks: function(query){
        return bookmarksCollection
        .deleteOne({id : query})
        .then(deleteStatus =>{
            return deleteStatus
        })
        .catch(err =>{
            return err;
        })
    },
    patchIdBookmarks: function(Id,title,des,url,rating){
        return  bookmarksCollection
        .findOne({id: Id},function(err, doc){
            if(err){
                return err;
            }
            if(doc == null){
                return doc;
            }
            if(title){
                doc.title = title;
            }
            if(des){
                doc.description = des;
            }
            if(url){
                doc.url = url;
            }
            if(rating!= null){
                doc.rating = Number(rating);
            }
            doc.save().then(doc =>{
                return doc;
            })
            .catch(err=>{
                return err;
            })
        }).then(result =>{
            return result;
        })
        .catch(err =>{
            return err;
        })

    },
    getIdBookmarks:function(Id){
        return bookmarksCollection.find({id : Id})
        .then(result =>{
            return result;
        })
        .catch(err =>{
            return err;
        })
    }
};

module.exports = {Bookmarks};