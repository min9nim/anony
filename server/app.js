const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
const PORT = 8080;
const DATAFILE = "data.json";

const fs = require("fs");
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '\\..\\public'));


app.get("/load", (req, res) => {
    fs.readFile(DATAFILE, (err, data) => {
        if(err) throw err;
        res.send(JSON.parse(data));
    })
});

app.post("/save", (req, res) => {
    fs.writeFile(DATAFILE, JSON.stringify(req.body, null, 2), (err) => {
        if(err) throw err;
        res.send({message : 'save success'});
    })
})


app.listen(PORT, function(){
    console.log(`express server is lintening on port ${PORT}`);
});

