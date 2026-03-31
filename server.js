

const express =  require("express");
const cvApp = express(); 
const port = 3000;

//View enginge: EJS
cvApp.set("view engine", "ejs");
//Statiska filer. Katalog public
cvApp.use(express.static("public"));

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