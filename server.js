const express = require("express");
const app = express();
var expressStaticGzip = require("express-static-gzip");

app.use(expressStaticGzip('dist'));

var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
