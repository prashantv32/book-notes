import express from "express";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

db.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error:", err.message));


// GET / → fetch all books and display them

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY created_at DESC");
        res.render("index.ejs", { books: result.rows });
    } catch (error) {
        console.error("Error fetching books:", error.message);
        res.status(500).send("Something went wrong while loading your books.");
    }
});


// GET /add → show the add book form

app.get("/add", (req, res) => {
    res.render("add.ejs");
});


// POST /add → take form data, insert into db

app.post("/add", async (req, res) => {
    const { title, author, rating, date_read, notes, isbn } = req.body;

    // basic validation — make sure required fields are present
    if (!title || !author) {
        return res.status(400).send("Title and author are required.");
    }

    try {
        await db.query(
            "INSERT INTO books (title, author, rating, date_read, notes, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
            [title, author, rating, date_read, notes, isbn]
        );
        res.redirect("/");
    } catch (error) {
        console.error("Error adding book:", error.message);
        res.status(500).send("Something went wrong while adding the book.");
    }
});


// GET /edit/:id → show edit form pre-filled

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        const book = result.rows[0];

        if (!book) {
            return res.status(404).send("Book not found.");
        }

        res.render("edit.ejs", { book: book });
    } catch (error) {
        console.error("Error fetching book for edit:", error.message);
        res.status(500).send("Something went wrong while loading the edit form.");
    }
});


// POST /edit/:id → update the book in db

app.post("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { title, author, rating, date_read, notes, isbn } = req.body;

    if (!title || !author) {
        return res.status(400).send("Title and author are required.");
    }

    try {
        await db.query(
            "UPDATE books SET title=$1, author=$2, rating=$3, date_read=$4, notes=$5, isbn=$6 WHERE id=$7",
            [title, author, rating, date_read, notes, isbn, id]
        );
        res.redirect("/");
    } catch (error) {
        console.error("Error updating book:", error.message);
        res.status(500).send("Something went wrong while updating the book.");
    }
});


// POST /delete/:id → delete the book from db

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).send("Something went wrong while deleting the book.");
    }
});


// GET /sort → sort books by rating/date/title

app.get("/sort", async (req, res) => {
    const sortBy = req.query.by; // gets the value after ?by=

    // whitelist allowed values to prevent SQL injection
    const allowed = ["rating", "date_read", "title"];
    const column = allowed.includes(sortBy) ? sortBy : "created_at";

    try {
        const result = await db.query(`SELECT * FROM books ORDER BY ${column} DESC`);
        res.render("index.ejs", { books: result.rows });
    } catch (error) {
        console.error("Error sorting books:", error.message);
        res.status(500).send("Something went wrong while sorting your books.");
    }
});


// catch-all for routes that don't exist

app.use((req, res) => {
    res.status(404).send("Page not found.");
});


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});