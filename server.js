const { Client } = require("pg");
//Hämtar data från .env-fil med rätt sökväg
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") 
});
const express =  require("express");
const cvApp = express(); 
const port = 3000;

//View enginge: EJS
cvApp.set("view engine", "ejs");
//Statiska filer. Katalog public
cvApp.use(express.static("public"));
cvApp.use(express.urlencoded({ extended: true }))


//Databasanslutning
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});



// Routing till varje view
cvApp.get("/", (request, response) => {
    response.render("index");
})

cvApp.get("/about", (request, response) => {
    response.render("about");
})

cvApp.get("/add", (request, response) => {
    response.render("add");
})


//Starta server
cvApp.listen(port, () => {
    console.log("server startad på port" + port)
});