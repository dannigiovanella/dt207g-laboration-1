const db = require("./db/db")
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



// Routing till varje view

//VY för startsida - Visar kurserna
cvApp.get("/", async (request, response) => {
  try {
    const result = await db.query("SELECT * FROM courses");

    response.render("index", {
      courses: result.rows
    });

  } catch (error) {
    console.log("DB error", error);

    response.render("index", {
      courses: []
    });
  }
});

//VY för OM-sidan
cvApp.get("/about", async (request, response) => {
    response.render("about");
})


// VY för att lägga till kurs
cvApp.get("/add", async (request, response) => {
  response.render("add", {
    error: null,
    old: {}
  });
});
  

//POST - Lägga till ny kurs
cvApp.post("/add", async (request, response) => {
  const { coursecode, coursename, progression, syllabus } = request.body;

  if (!coursecode || !coursename || !progression || !syllabus) {
    return response.render("add", {
      error: "Fyll i alla fält",
      old: request.body
    });
  }

  try {
    await db.query(
      "INSERT INTO courses (coursecode, coursename, progression, syllabus) VALUES ($1, $2, $3, $4)",
      [coursecode, coursename, progression, syllabus]
    );
    response.redirect("/");
  } 
  catch (error) {
    console.log("DB error", error);

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