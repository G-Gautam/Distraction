const express = require('express');
const bodyParser = require('body-parser');

const product = require('./routes/route'); // Imports routes for the products
const app = express();


// app.get('/',function(req,res){
//     res.sendFile(__dirname + '/views/index.html');
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', product);
app.use('/front', express.static(__dirname + '/views/front'));
let port = 8080;

app.listen(process.env.PORT || 5000), () => {
    console.log('Server is up and running on port numner ' + port);
};