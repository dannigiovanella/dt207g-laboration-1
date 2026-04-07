

const { Pool } = require("pg");

//Hämtar data från .env-fil med rätt sökväg
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") 
});


//Databasanslutning
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;

//Funktion för att connecta 
async function connect() {
  try {
    await client.connect();
    console.log("Connected");
  } catch (err) {
    console.log("Error", err);
  }
}

connect();