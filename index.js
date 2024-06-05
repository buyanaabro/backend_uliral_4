const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
const db = require("./db");
db.connect;
app.use(express.json());

app.get("/items", (req, res) => {
  db.query("select * from items", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(results);
      res.status(200).send(results);
    }
  });
});

app.post("/shop", (req, res) => {
  const { shopName } = req.body;
  db.query(`insert into shop (shopName) values (?)`, [shopName], (err, res) => {
    if (err) res.send(err);
    console.log("added shop");
  });
});

app.post("/shops/:shopID/items", (req, res) => {
  const { shopID } = req.params;
  const { items } = req.body;

  items.forEach((item) => {
    const { itemName, price } = item;
    const sql = `insert into items (itemName, price, shopID) values (?, ?, ?)`;
    db.query(sql, [itemName, price, shopID], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("error adding items");
      } else {
        console.log("added items");
        return res.status(201).send("items added");
      }
    });
  });
});

app.patch("/items/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  let sql = "update items set ";
  let updates = [];
  if (typeof updateData === "string") {
    updates.push(`price = ?`);
    updateData = parseInt(updateData);
  } else {
    for (const field in updateData) {
      updates.push(`${field} = ?`);
    }
  }
  sql += updates.join(", ");
  sql += " where itemID = ?";

  db.query(sql, [...Object.values(updateData), id], (err, res) => {
    if (err) console.error(err);
    else if (res.affectedRows === 0) {
      console.log("item not found");
      return 0;
    } else {
      console.log("item updated");
      return 0;
    }
  });
});

app.delete("/items/:id", (req, res) => {
  const { id } = req.params;

  db.query("delete from items where itemID = ?", [id], (err, res) => {
    if (err) console.error(err);
    else if (res.affectedRows === 0) console.error("item not found");
    else {
      console.log("item deleted");
      return 0;
    }
  });
});

//! lab3

app.get("/students", (req, res) => {
  const query = "SELECT * FROM students";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/books", (req, res) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/borrows", (req, res) => {
  const query = "SELECT * FROM borrows";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/authors", (req, res) => {
  const query = "SELECT * FROM authors";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/types", (req, res) => {
  const query = "SELECT * FROM types";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/students", (req, res) => {
  const { name, surname, birthdate, gender, className, point } = req.body;

  const query = `INSERT INTO students (name, surname, birthdate, gender, class, point) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, surname, birthdate, gender, className, point];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("student added");
      res.status(201).send("student added");
    }
  });
});

app.post("/books", (req, res) => {
  const { name, pagecount, point, authorId, typeId } = req.body;

  const query = `INSERT INTO books (name, pagecount, point, authorId, typeId) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, pagecount, point, authorId, typeId];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("book added");
      res.status(201).send("book added");
    }
  });
});

app.post("/borrows", (req, res) => {
  const { studentId, bookId, takenDate, broughtDate } = req.body;

  const query = `INSERT INTO borrowings (studentId, bookId, takenDate, broughtDate) VALUES (?, ?, ?, ?)`;
  const values = [studentId, bookId, takenDate, broughtDate];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("borrows record added");
      res.status(201).send("borrows record added");
    }
  });
});

app.post("/authors", (req, res) => {
  const { name, surname } = req.body;

  const query = `INSERT INTO authors (name, surname) VALUES (?, ?)`;
  const values = [name, surname];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("author added");
      res.status(201).send("author added");
    }
  });
});

app.post("/types", (req, res) => {
  const { name } = req.body;

  const query = `INSERT INTO types (name) VALUES (?)`;
  const value = [name];

  db.query(query, value, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("Type added successfully");
      res.status(201).send("Type added successfully");
    }
  });
});

app.post("/borrow-books/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { borrowedBooks } = req.body;

  db.query(
    "SELECT * FROM students WHERE studentId =?",
    [studentId],
    (err, studentResults) => {
      if (err || !studentResults.length) {
        console.error(err);
        return res.status(404).send("student not found");
      }

      const bookIds = borrowedBooks.map((bookId) => parseInt(bookId));

      borrowedBooks.forEach((bookId) => {
        const borrowQuery =
          "INSERT INTO borrows (studentId, bookId, takenDate, broughtDate) VALUES (?,?, NOW(), NULL)";
        db.query(borrowQuery, [studentId, bookId], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("failed to log book borrowing");
          }
        });
      });

      res.status(201).send({ message: "borrowed books logged successfully" });
    },
  );
});

app.post("/insert", (req, res) => {
  const { table, data } = req.body;

  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const values = Object.values(data);

  const query = `INSERT INTO ${mysql.escapeId(
    table,
  )} (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      console.log(`${table} record added`);
      return res.status(201).send(`${table} record added`);
    }
  });
});

app.get("/all-info", (req, res) => {
  const queries = [
    { query: "SELECT * FROM students" },
    { query: "SELECT * FROM books" },
    { query: "SELECT * FROM borrows" },
    { query: "SELECT * FROM authors" },
    { query: "SELECT * FROM types" },
  ];

  const results = {};
  let completedQueries = 0;

  queries.forEach(({ query }, index) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("error");
        return;
      }

      switch (index) {
        case 0:
          results.students = rows;
          break;
        case 1:
          results.books = rows;
          break;
        case 2:
          results.borrows = rows;
          break;
        case 3:
          results.authors = rows;
          break;
        case 4:
          results.types = rows;
          break;
      }

      completedQueries++;

      if (completedQueries === queries.length) {
        res.status(200).json(results);
      }
    });
  });
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT authorId FROM books WHERE bookId =?",
    [id],
    (err, results) => {
      if (err || !results.length) {
        console.error(err);
        return res.status(404).send("Book not found");
      }

      const authorId = results[0].authorId;

      db.query("DELETE FROM books WHERE bookId = ?", [id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("failed to delete the book");
        }

        db.query(
          "DELETE FROM authors WHERE authorId = ?",
          [authorId],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send("failed to delete author");
            }

            console.log("book and author deleted successfully");
            res.status(200).send("book and author deleted successfully");
          },
        );
      });
    },
  );
});

app.post("/books-with-author", (req, res) => {
  const { name, pagecount, point, typeId, authorName, authorSurname } =
    req.body;

  const authorQuery = `INSERT INTO authors (name, surname) VALUES (?,?)`;
  db.query(authorQuery, [authorName, authorSurname], (err, authorResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to insert author");
    }

    const authorId = authorResult.insertId;

    const bookQuery = `INSERT INTO books (name, pagecount, point, typeId, authorId) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      bookQuery,
      [name, pagecount, point, typeId, authorId],
      (err, bookResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send("failed to insert book");
        }

        console.log("author and book added successfully");
        res.status(201).send({
          message: "author and book added successfully",
          bookId: bookResult.insertId,
          authorId: authorId,
        });
      },
    );
  });
});

app.delete("/borrows/student/:studentId", (req, res) => {
  const { studentId } = req.params;

  const deleteQuery = "DELETE FROM borrows WHERE studentId =?";

  db.query(deleteQuery, [studentId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("failed to delete borrow records");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("no borrow records found for this student");
    }

    res
      .status(200)
      .send("all borrow records for this student deleted successfully");
  });
});

app.post("/borrow-high-point-books", (req, res) => {
  const getMaleStudents =
    "SELECT studentId FROM students WHERE gender = 'male'";
  db.query(getMaleStudents, (err, studentResults) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching male students");
    }

    const studentIds = studentResults.map((student) => student.studentId);

    const getHighPointBooks = "SELECT bookId FROM books WHERE point > 50";
    db.query(getHighPointBooks, (err, bookResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching high point books");
      }

      const bookIds = bookResults.map((book) => book.bookId);

      studentIds.forEach((studentId) => {
        bookIds.forEach((bookId) => {
          const borrowQuery =
            "INSERT INTO borrows (studentId, bookId, takenDate, broughtDate) VALUES (?, ?, NOW(), NULL)";
          db.query(borrowQuery, [studentId, bookId], (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Book ${bookId} borrowed by student ${studentId}`);
            }
          });
        });
      });

      res
        .status(200)
        .send("Borrow records for high point books added successfully");
    });
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
