let path = require('path');
let express = require('express');
let cors = require('cors')
const bodyParser = require('body-parser')
// const multer = require('multer') // v1.0.5
// const upload = multer() // for parsing multipart/form-data
const fileUpload = require('express-fileupload');

let app = express();

let staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3001);
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(fileUpload());

app.post('/upload', (req, res, next) => {
	console.log('req', req)
	res.send("!success!");
});

app.get('/test', (req, res, next) => {
	res.send('ok');
});

let server = app.listen(app.get('port'), function () {
	console.log('listening ', app.get('port'));
});
