/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(10);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };
  if (!newBook.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  books.push(newBook);
  response.code(201);
  return response;
};

const getAllBook = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const lowName = name.toLowerCase();
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((n) => n.name.toLowerCase().includes(lowName))
          .map((books) => ({
            id: books.id,
            name: books.name,
            publisher: books.publisher,
          })),
      },
    });
    return response;
  }

  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((r) => r.reading === false)
          // eslint-disable-next-line no-shadow
          .map((books) => ({
            id: books.id,
            name: books.name,
            publisher: books.publisher,
          })),
      },
    });
    return response;
  }
  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((r) => r.reading === true)
          .map((books) => ({
            id: books.id,
            name: books.name,
            publisher: books.publisher,
          })),
      },
    });
    return response;
  }

  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((r) => r.finished === false)
          .map((books) => ({
            id: books.id,
            name: books.name,
            publisher: books.publisher,
          })),
      },
    });
    return response;
  }

  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((r) => r.finished === true)
          .map((books) => ({
            id: books.id,
            name: books.name,
            publisher: books.publisher,
          })),
      },
    });
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(books[index], 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBook, getAllBook, getBookById, updateBook, deleteBook,
};
