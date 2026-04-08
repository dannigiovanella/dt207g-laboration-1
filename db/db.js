
// Importerar Pool från pg. (för att hantera flera databasanrop) 
const { Pool } = require("pg");

//Hämtar data från .env-fil med rätt sökväg
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") 
});


////// DATABASANSLUTNING ///////

//Skapar pool istället från enskild client
const pool = new Pool({
  //URL till databasen hämtas från .env
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

//Exporterar poolen så den kan användas i andra filer som server.js
module.exports = pool;


//Funktion för att testa anslutning 

async function connect() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected");
  } catch (err) {
    console.log("Error when connecting", err);
  }
}

//Kör testfunktion när filen startas
connect();