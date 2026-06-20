import express from "express";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));  
app.use(express.urlencoded({ extended: true })); 

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect();


// GET / → fetch all books and display them

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM books ORDER BY created_at DESC");
    res.render("index.ejs",{ books : result.rows })
});


// GET /add → show the add book form

app.get("/add", (req, res) => {
    res.render("add.ejs");
});


// POST /add → take form data, insert into db


app.post("/add", async (req, res) => {
    const {title,author,rating,date_read,notes,isbn} = req.body;

    db.query("INSERT INTO  books (title,author,rating,date_read ,notes ,isbn) VALUES ($1,$2,$3,$4,$5,$6)",
        [title,author,rating,date_read,notes,isbn]
    );

    

     // after adding, go back to home
     res.redirect("/")
});


// GET /edit/:id → show edit form pre-filled

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM books WHERE id=$1",[id]);
    const book = result.rows[0];
    res.render("edit.ejs",{ book : book })
    
});             


// POST /edit/:id → update the book in db

app.post("/edit/:id", async (req, res) => {
    const id= req.params.id;
    const { title,author,rating,date_read,notes,isbn} = req.body;

    const book = await db.query("UPDATE books SET title={$1},author={$2},rating{$3},date_read={$4},notes={$5},isbn={$6}",[title,author,rating,date_read,notes,isbn]);

    res.redirect("/");
    
});


// POST /delete/:id → delete the book from db

app.post("/delete/:id", async (req, res) => {
    const id =  req.params.id;
    
    const book = await db.query("DELETE FROM books WHERE id=$1",[id]);
    
    res.redirect("/")

    ;
});


// GET /sort → sort books by rating/date/title

app.get("/sort", async (req, res) => {
    const sortBy = req.query.by; // gets the value after ?by=

    // whitelist allowed values to prevent SQL injection
    const allowed = ["rating", "date_read", "title"];
    const column = allowed.includes(sortBy) ? sortBy : "created_at";

    const result = await db.query(`SELECT * FROM books ORDER BY ${column} DESC`);
    res.render("index.ejs", { books: result.rows });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port} `);
});