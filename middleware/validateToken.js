const TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function validateToken( req, res, next ){
    let accesGranted = false;
    let token = req.headers.authorization;
    let token2 = req.headers.book_api_key;
    let token3 = req.query.apiKey;

    console.log(token+" "+token2+" "+token3);

    if( !token && !token2 && !token3 ){
        res.statusMessage = "You need to send the apiKey .";
        return res.status( 401 ).end();
    }
    if(token){
        if( token === `Bearer ${TOKEN}` ){
            accesGranted = true;
        }
    }
    if(token2){
        if( token2 === TOKEN ){
            accesGranted = true;
        }
    }
    if(token3){
        if( token3 === TOKEN ){
            accesGranted = true;
        }
    }
    if(!accesGranted){
        res.statusMessage = "The Api TOKEN is invalid.";
        return res.status( 401 ).end();
    }
    next();

}

module.exports = validateToken;