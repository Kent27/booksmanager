let mongoose = require("mongoose");
let Book = require("../models/Book");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

// Change environment for test
process.env.NODE_ENV = "test";
process.env.PORT = "5001";

chai.use(chaiHttp);

describe("Books", () => {
  beforeEach(done => {
    //empty the database before test
    Book.deleteMany({ _id: { $nin: ["5d3aee0a1d9466422f318850"] } }, err => {
      done();
    });
  });

  /*
   * Begin: Test GET all books
   */
  describe("GET all books successfully", () => {
    it("it should GET all the books", done => {
      chai
        .request(server)
        .get("/api/books")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  // End: Test /GET all books

  /*
   * Begin: Test the CREATE a book
   */
  describe("Create a book validate title and author", () => {
    it("it should not Create a book without title or author field", done => {
      let book = {
        isbn: "12345",
        publishedOn: "2010",
        numberOfPages: "180"
      };
      chai
        .request(server)
        .post("/api/books")
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("author");
          res.body.should.have.property("title").eql("Title field is required");
          res.body.should.have
            .property("author")
            .eql("Author field is required");
          done();
        });
    });
  });

  describe("Create book validate published on", () => {
    it("it should not Create a book if the field publishedOn is not numeric", done => {
      let book = {
        title: "Book 1",
        author: "Kent",
        isbn: "12345",
        publishedOn: "asdf",
        numberOfPages: "180"
      };
      chai
        .request(server)
        .post("/api/books")
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("publishedOn");
          res.body.should.have
            .property("publishedOn")
            .eql("Published year must be numeric");
          done();
        });
    });
  });

  describe("Create a book successfully", () => {
    it("it should Create a book", done => {
      let book = {
        title: "Book 1",
        author: "Kent",
        isbn: "12345",
        publishedOn: "2010",
        numberOfPages: "180"
      };
      chai
        .request(server)
        .post("/api/books")
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          done();
        });
    });
  });
  // End: Test CREATE a book

  /*
   * Begin: Test /GET one book
   */
  describe("GET a book not found", () => {
    it("it should fail to GET the specified book", done => {
      chai
        .request(server)
        .get("/api/books/123")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.should.have
            .property("error")
            .eql("No book found with that ID");
          done();
        });
    });
  });
  describe("GET a book successfully", () => {
    it("it should GET the specified book", done => {
      chai
        .request(server)
        .get("/api/books/5d3aee0a1d9466422f318850")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // End: Test CREATE a book

  /*
   * Begin: Test the Update a book
   */
  describe("Update a book not found", () => {
    it("it should fail to find the specified book", done => {
      chai
        .request(server)
        .get("/api/books/123")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.should.have
            .property("error")
            .eql("No book found with that ID");
          done();
        });
    });
  });
  describe("Update a book validate title and author", () => {
    it("it should not Update a book without title or author field", done => {
      let book = {
        isbn: "12345",
        publishedOn: "2010",
        numberOfPages: "180"
      };
      chai
        .request(server)
        .put("/api/books/5d3aee0a1d9466422f318850")
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("author");
          res.body.should.have.property("title").eql("Title field is required");
          res.body.should.have
            .property("author")
            .eql("Author field is required");
          done();
        });
    });
  });

  describe("Update book validate number of pages", () => {
    it("it should not Update a book if the field number of pages is not numeric", done => {
      let book = {
        title: "Book 1",
        author: "Kent",
        isbn: "12345",
        publishedOn: "2002",
        numberOfPages: "asdf"
      };
      chai
        .request(server)
        .put("/api/books/5d3aee0a1d9466422f318850")
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("numberOfPages");
          res.body.should.have
            .property("numberOfPages")
            .eql("Number of pages must be numeric");
          done();
        });
    });
  });

  describe("Update a book successfully", () => {
    it("it should Update a book", done => {
      let book = {
        title: "Book 1",
        author: "Kent",
        isbn: "12345",
        publishedOn: "2010",
        numberOfPages: "180"
      };
      chai
        .request(server)
        .put("/api/books/5d3aee0a1d9466422f318850")
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End: Test Update a book

  /*
   * Begin: Test the Delete a book
   */
  describe("Delete a book not found", () => {
    it("it should fail to find the specified book", done => {
      chai
        .request(server)
        .delete("/api/books/123")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.should.have.property("error").eql("No book found");
          done();
        });
    });
  });

  describe("Delete a book successfully", () => {
    it("it should Delete a book", done => {
      let book = new Book({
        title: "Book 2",
        author: "Kent",
        isbn: "12345",
        publishedOn: "2010",
        numberOfPages: "180"
      });
      book.save((err, book) => {
        chai
          .request(server)
          .delete("/api/books/" + book.id)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
  // End: Test Delete a book
});
