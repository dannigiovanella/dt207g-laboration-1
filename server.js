//Importerar databaskopplingen fråndb.js
const db = require("./db/db")

//Hämtar data/variabler från .env-fil (ex: PORT och DATABAS_URL)
const path = require("path");
require("dotenv").config();

const express = require("express");
const cvApp = express();

//View enginge: EJS. För att kunna rendera dynamiska sidor
cvApp.set("view engine", "ejs");

//Statiska filer (CSS). Katalog public
cvApp.use(express.static("public"));
//För att kunna läsa in formulärdata (även kunna lägga till fil)
cvApp.use(express.urlencoded({ extended: true }))



////// ROUTING - till varje view ///////

//VY för startsida - Hämtar och visar kurser från databas
cvApp.get("/", async (request, response) => {
  try {
    //Hämtar alla kurser
    const result = await db.query("SELECT * FROM courses");
    //Skickar kurserna till index-vyn
    response.render("index", {
      courses: result.rows
    });

  } catch (error) {
    console.log("DB error", error);
    //Om nåt går fel visas en tom lista istället
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
    //Tomt errorobjekt för att undvika undefined
    errors: {},
    //Tomt objekt för gamla inputs
    old: {}
  });
});


/////// POST - Lägga till ny kurs //////

cvApp.post("/add", async (request, response) => {
  //Hämtar data från formulär
  const { coursecode, coursename, progression, syllabus } = request.body;

  // Objekt för att spara fel per fält
  let errors = {};
  let hasError = false;

  //Validering av varje input-fält

  // Kurskod
  if (!coursecode) {
    errors.coursecode = "Kurskod måste fyllas i";
    hasError = true;
  }

  // Kursnamn
  if (!coursename) {
    errors.coursename = "Kursnamn måste fyllas i";
    hasError = true;
  }

  // Progression
  if (!progression) {
    errors.progression = "Välj nivå";
    hasError = true;
  }

  // Syllabus
  if (!syllabus) {
    errors.syllabus = "Saknas länk till kursplan";
    hasError = true;
  }

  // Om något är fel så skickas man tillbaka till formuläret
  if (hasError) {
    return response.render("add", {
      errors,
      old: request.body
    });
  }

  // Lägger till nyy kurs i databasen
  try {
    await db.query(
      "INSERT INTO courses (coursecode, coursename, progression, syllabus) VALUES ($1, $2, $3, $4)",
      [coursecode, coursename, progression, syllabus]
    );

    //Redirect till startsida efter lyckad insert
    response.redirect("/");
  }
  catch (error) {
    console.log("DB error", error);

    //Om nåbot db-fel visas formulär igen
    response.render("add", {
      error: "Något gick fel när kursen sparades",
      old: request.body
    });
  }
});

////// DELETE - Ta bort kurs /////

cvApp.post("/delete/:id", async (request, response) => {
  //Hämtar id för kurs
  const { id } = request.params;

  try {
    //Tar bort en kurs baserat på course_id
    await db.query("DELETE FROM courses WHERE course_id = $1", [id]);
    //Uppdaterar startsidan efter delete
    response.redirect("/");

    //Om fel vid delete
  } catch (error) {
    console.log("Delete error", error);
    response.redirect("/");
  }
});

/////// STARTA SERVER /////

const PORT = process.env.PORT || 3000;

// Startar servern på en port från .env
cvApp.listen(PORT, () => {
  console.log("server startad på port" + "" + PORT);
});