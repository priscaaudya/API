const {nanoid} = require('nanoid');
const books = require('./books');
 
//addBookHandler
// menambah data buku baru
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
 
  const id = nanoid(16);
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
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
 
  if (!newBook.name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
 
    response.code(400);
    return response;
  }
 
  if (newBook.pageCount < newBook.readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
 
    response.code(400);
    return response;
 
  }
 
  if (newBook.pageCount >= newBook.readPage) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
    bookId: id
 
      },
    });
 
    books.push(newBook);
 
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
 
    response.code(500);
    return response;
  }
};
//getAllBookHandler
// menampilkan semua data buku
const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;
 
  let book;
 
  if (reading === '1') {
    const read = books.filter((book) => book.reading === (reading === '1')).map((book) => ({
      'id': book.id,
      'name': book.name,
      'publisher': book.publisher,
    }));
    book = read;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
 
  if (reading === '0') {
    const unread = books.filter((book) => book.reading === (reading !== '1')).map((book) => ({
      'id': book.id,
      'name': book.name,
      'publisher': book.publisher,
    }));
    book = unread;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
 
  if (finished === '0') {
    const unfinish = books.filter((book) => book.finished === false).map((book) => ({
      'id': book.id,
      'name': book.name,
      'publisher': book.publisher,
    }));
    book = unfinish;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
 
  if (finished === '1') {
    const finish = books.filter((book) => book.finished === (finished === '1')).map((book) => ({
      'id': book.id,
      'name': book.name,
      'publisher': book.publisher,
    }));
    book = finish;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
 
  if (name) {
    const filterName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
      'id': book.id,
      'name': book.name,
      'publisher': book.publisher,
    }));
    book = filterName;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
 
  if (name === undefined) {
    const randomBook = books.map((book) => {
      return {
        'id': book.id,
        'name': book.name,
        'publisher': book.publisher,
      };
    });
    book = randomBook;
    return h.response({
      status: 'success',
      data: {
        'books': book,
      },
    });
  }
};
 
 
//getBookByIdHandler
// menampilkan data buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
 
  const book = books.filter((n) => n.id === id)[0];
 
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
 
//updateBookHandler
// mengubah data buku
const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
 
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
 
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
 
  if (index !== -1) {
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
  };
  
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
 
  response.code(200);
  return response;
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
 
  response.code(404);
  return response;
 
};
 
//deleteBookHandler
// menghapus data buku
const deleteBookHandler = (request, h) => {
  const {id} = request.params;
 
  const index = books.findIndex((book) => book.id === id);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
 
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
 
  response.code(404);
  return response;
};
 
module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, updateBookHandler, deleteBookHandler};