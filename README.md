# 📚 Book Notes

A personal book notes tracker — inspired by [Derek Sivers' book notes page](https://sive.rs/book) — where I log every non-fiction book I read, rate it, and write down the ideas worth remembering.

## Live demo

[https://book-notes-app-cmkf.onrender.com](https://book-notes-app-cmkf.onrender.com)

> Hosted on Render's free tier, so the first request after a period of inactivity may take 30–50 seconds to wake up.

## Why I built this

I read a lot of books but a few months later I can barely recall the parts that actually mattered. So instead of just reading, I started writing short notes after every book — the core idea, what stuck with me, what I'd want to remember in five years.

Derek Sivers does this publicly on his site, and I loved the simplicity of it: a list of books, a rating, a date, and a few honest sentences about each one. This project is my own version of that — a small full-stack app to store and revisit my reading notes, built completely from scratch as a way to practice the entire web development flow: planning a database, building a backend, and serving it through a real frontend.

## What it does

- Add a book with its title, author, rating (1–10), date read, and personal notes
- Edit or delete any entry later
- Automatically pulls the book cover from the **Open Library Covers API** using the ISBN
- Sort all entries by rating, date read, or title
- All data is persisted in a **PostgreSQL** database, so nothing is lost on refresh or restart

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (`pg` driver) |
| Templating | EJS |
| Frontend | HTML, CSS, vanilla JS |
| External API | [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) |
| Hosting | Render (app) + Supabase (database) |

The app follows a classic **server-side rendered** architecture — no React, no client-side framework. Express handles routing and talks to PostgreSQL directly, then renders complete HTML pages with EJS. Book covers are the one piece that load client-side: the browser fetches them straight from Open Library using the book's ISBN, so the backend never has to touch that API itself.

## Project structure

```
book-notes/
├── public/
│   ├── styles/
│   │   └── main.css
│   └── images/
│       └── no-cover.png
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── add.ejs
│   └── edit.ejs
├── index.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Database schema

One table, `books`:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  date_read DATE,
  notes TEXT,
  isbn VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

The `isbn` column is what links each entry to its cover image — covers are fetched on the fly via:

```
https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg
```

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

## Error handling

Every route that touches the database is wrapped in a try/catch block. Errors are logged to the console for debugging, and the user gets a plain-language message instead of a raw stack trace or a silent failure. The `/add` and `/edit/:id` routes also validate that a title and author were actually submitted before hitting the database. There's also a catch-all 404 handler for any route that doesn't exist.

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
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/book_notes
```

**5. Start the server**
```bash
nodemon index.js
```

The app will be running at `http://localhost:3000`.

## Deployment

The app is deployed on **Render** (free Web Service tier), connected directly to this GitHub repo for auto-deploys on push. The database is hosted on **Supabase** (free PostgreSQL tier, no expiry), using their connection pooler for reliable IPv4 connectivity from Render's servers.

In production, the `DATABASE_URL` environment variable is set in Render's dashboard rather than in a local `.env` file.



