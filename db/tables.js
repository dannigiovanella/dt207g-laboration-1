
//Tabeller

const db = require("./db");

async function createTable() {
    try {
        await pool.connect();

        await db.query(`
    CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY, 
    coursecode VARCHAR(15) NOT NULL,
    coursename TEXT NOT NULL,
    progression CHAR(1) NOT NULL,
    syllabus TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
        console.log("Table created");
    } catch (error) {
        console.log("Error creating table", error);
    } finally {
        await db.end();
    }
}

createTable();