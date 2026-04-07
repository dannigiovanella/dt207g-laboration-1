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
    errors: {},
    old: {}
  });
});
  

//POST - Lägga till ny kurs
cvApp.post("/add", async (request, response) => {
  const { coursecode, coursename, progression, syllabus } = request.body;

  //Kontroll för om fält blivit ifyllda
  let errors = {};
  let hasError = false;

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

//DELETE - Ta bort kurs
cvApp.post("/delete/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await db.query("DELETE FROM courses WHERE course_id = $1", [id]);
    response.redirect("/");

  } catch (error) {
    console.log("Delete error", error);
    response.redirect("/");
  }
});

//Starta server
cvApp.listen(process.env.PORT, () => {
    console.log("server startad på port" + "" + process.env.PORT);
});