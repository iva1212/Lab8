const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addBookmarkFech( title,des,Burl,rating ){
    let url = '/bookmarks';

    let data = {
        title : title,
        description: des,
        url: Burl,
        rating: Number(rating)
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            alert("Bookmark created");
            fetchBookmarks();
        })
        .catch( err => {
            alert(err.message);
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `
                <div class="panel panel-info bookmark${i}">
                    <div class="panel-heading">
                        <div class="bookmark-title">${responseJSON[i].title}</div>
                    </div> 
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-sm-11">
                                <div class="bookmark-des">${responseJSON[i].description}</div>
                                <div class="bookmark-url">${responseJSON[i].url}</div>
                                <div class="bookmark-rating">${responseJSON[i].rating}</div>
                            </div>
                            <div class="col-sm-1">
                                <div class="btnEdit${i}"><button class="btn btn-default" onclick = "editBookmark(${i},'${responseJSON[i].id}')">Edit</button></div>
                                <div class="btnDelete${i}"><button class="btn btn-danger" onclick="deleteBookmark('${responseJSON[i].id}')">Delete</button></div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        })
        .catch( err => {
            alert(err.message);
        });
    
}

function deleteBookmark(Bid){

    let url = '/bookmark/'+Bid;
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                fetchBookmarks();
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            alert(err.message);
        });
}
function editBookmark(pos,Bid){
    let bookmark = document.querySelector( '.bookmark'+pos );

    let title = bookmark.querySelector('.bookmark-title');
    let titleInput = '<input type="text" value = "'+title.textContent+'" id="bookmarkTitleE'+pos+'">'
    title.innerHTML = titleInput;

    let description = bookmark.querySelector('.bookmark-des');
    let desInput = '<input type="text" value = "'+description.textContent+'" id="bookmarkDesE'+pos+'">'
    description.innerHTML = desInput;

    let url = bookmark.querySelector('.bookmark-url');
    let urlInput = '<input type="text" value = "'+url.textContent+'" id="bookmarkUrlE'+pos+'">'
    url.innerHTML = urlInput;

    let rating = bookmark.querySelector('.bookmark-rating');
    let ratingInput = '<input type="number" value = "'+rating.textContent+'" id="bookmarkRatingE'+pos+'">'
    rating.innerHTML = ratingInput;


    let button = bookmark.querySelector('.btnEdit'+pos);
    let buttonSave = '<button class="btn btn-default" onclick = "saveBookmark('+pos+','+'\''+Bid+'\')">Save</button>'
    button.innerHTML = buttonSave ;
    

}
function saveBookmark(pos,Bid){
    let bookmark = document.querySelector( '.bookmark'+pos );
    console.log(bookmark);
    let title = document.getElementById('bookmarkTitleE'+pos).value;
    let des = document.getElementById('bookmarkDesE'+pos).value;
    let Burl = document.getElementById('bookmarkUrlE'+pos).value;
    let rating = document.getElementById('bookmarkRatingE'+pos).value;

    let url = '/bookmark/'+Bid;

    let data = {
        id : Bid,
        title : title,
        description: des,
        url: Burl,
        rating: Number(rating)
    }
    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    console.log(settings);

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                fetchBookmarks();
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            alert(err.message);
        });

}
function searchBookmark(title){
    console.log(title);
    let url = '/bookmark?title='+title;

    

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            
        },
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            console.log(responseJSON);
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `
                <div class="panel panel-info bookmark${i}">
                    <div class="panel-heading">
                        <div class="bookmark-title">${responseJSON[i].title}</div>
                    </div> 
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-sm-11">
                                <div class="bookmark-des">${responseJSON[i].description}</div>
                                <div class="bookmark-url">${responseJSON[i].url}</div>
                                <div class="bookmark-rating">${responseJSON[i].rating}</div>
                            </div>
                            <div class="col-sm-1">
                                <div class="btnEdit${i}"><button class="btn btn-default" onclick = "editBookmark(${i},'${responseJSON[i].id}')">Edit</button></div>
                                <div class="btnDelete${i}"><button class="btn btn-danger" onclick="deleteBookmark('${responseJSON[i].id}')">Delete</button></div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        })
        .catch( err => {
            alert(err.message);
        });

    



}

function watchBookmarksForm(){
    let bookmarkForm = document.querySelector( '.bookmark-form' );

    bookmarkForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchBookmarks();
    });
}

function watchAddBookmarkForm(){
    let bookmarkForm = document.querySelector( '.add-bookmark-form' );

    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitle' ).value;
        let des = document.getElementById( 'bookmarkDes' ).value;
        let Burl = document.getElementById( 'bookmarkUrl' ).value;
        let rating = document.getElementById( 'bookmarkRating' ).value;
        addBookmarkFech( title, des,Burl,rating);
    })
    bookmarkForm.reset();
}

function watchSearchBookmarkForm(){
    let searchForm = document.querySelector('.search-bookmark-form');

    searchForm.addEventListener('submit',(event) =>{
        event.preventDefault();

        let title = document.getElementById('searchBookmark').value;

        searchBookmark(title);
    })
}

function init(){
    watchBookmarksForm();
    watchAddBookmarkForm();
    watchSearchBookmarkForm();
    fetchBookmarks();
}

init();