# 📚 Book Notes 

A Personal book notes tracker -  inspired by [Derek Siver's book note page](https://sive.rs/book) - where I log every non-fiction book I read , I rate it  and write down the ideas worth remembering.

## Why I built this
 
I read a lot of books but a few months later I can barely recall the parts that actually mattered. So instead of just reading, I started writing short notes after every book — the core idea, what stuck with me, what I'd want to remember in five years.
 
Derek Sivers does this publicly on his site, and I loved the simplicity of it: a list of books, a rating, a date, and a few honest sentences about each one. This project is my own version of that — a small full-stack app to store and revisit my reading notes, built completely from scratch as a way to practice the entire web development flow: planning a database, building a backend, and serving it through a real frontend.

## What it does 

- Add a book with its title, author, rating (1–10), date read, and personal notes
- Edit or delete any entry later
- Automatically pulls the book cover from the **Open Library Covers API*
* using the ISBN
- sort all entries by rating,title, or date read
- All data is persisted in a **PostgreSQL** database ,so nothing is lost on refresh or restart.

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (`pg` driver) |
| Templating | EJS |
| Frontend | HTML, CSS, vanilla JS |
| External API | [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) |

## Routes
 
| Method | Route | Description |
|---|---|---|
| GET | `/` | Show all books |
| GET | `/add` | Show the add-book form |
| POST | `/add` | Save a new book to the database |
| GET | `/edit/:id` | Show the edit form, pre-filled |
| POST | `/edit/:id` | Update a book's details |
| POST | `/delete/:id` | Delete a book |
| GET | `/sort?by=rating\|date_read\|title` | Sort the book list |
 
## Running it locally
 
**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/book-notes-app.git
cd book-notes-app
```
 
**2. Install dependencies**
```bash
npm i
```
 
**3. Set up PostgreSQL**
 
Create a database called `book_notes` and run the schema above inside it (using `psql` or pgAdmin's Query Tool).
 
**4. Create a `.env` file** in the project root:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=book_notes
DB_PASSWORD=your_password
DB_PORT=5432
```
 
**5. Start the server**
```bash
nodemon index.js
```
 
The app will be running at `http://localhost:3000`.
 
