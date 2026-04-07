const { Client } = require("pg");
//Hämtar data från .env-fil 
const path = require("path");
require("dotenv").config();

const express = require("express");
const cvApp = express();

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
cvApp.get("/", async (request, response) => {
    response.render("index");
})

cvApp.get("/about", async (request, response) => {
    response.render("about");
})

cvApp.get("/add", async (request, response) => {
    response.render("add");
})


//Starta server
cvApp.listen(process.env.PORT, () => {
    console.log("server startad på port" + "" + process.env.PORT);
});