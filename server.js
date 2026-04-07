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

cvApp.post("/add", async (request, response) => {
  const { coursecode, coursename, progression, syllabus } = request.body;

  if (!coursecode || !coursename || !progression || !syllabus) {
    return response.render("add", {
      error: "Fyll i alla fält",
      old: request.body
    });
  }

  try {
    await client.query(
      "INSERT INTO courses (coursecode, coursename, progression, syllabus) VALUES ($1, $2, $3, $4)",
      [coursecode, coursename, progression, syllabus]
    );
    response.redirect("/");
  } 
  catch (err) {
    console.log("DB error", err);

    response.render("add", {
      error: "Något gick fel när kursen sparades",
      old: request.body
    });
  }
});




//Starta server
cvApp.listen(process.env.PORT, () => {
    console.log("server startad på port" + "" + process.env.PORT);
});