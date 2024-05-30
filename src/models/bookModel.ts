import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  publishedDate: Date;
  userId: number;
}

export async function createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
  const createdBook = await prisma.book.create({
    data: bookData,
  });
  return createdBook;
}

export async function getBookById(id: number): Promise<Book | null> {
  const book = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
  return book;
}

export async function updateBook(id: number, bookData: Partial<Book>): Promise<Book | null> {
  const updatedBook = await prisma.book.update({
    where: {
      id: id,
    },
    data: bookData,
  });
  return updatedBook;
}

export async function deleteBook(id: number): Promise<Book | null> {
  const deletedBook = await prisma.book.delete({
    where: {
      id: id,
    },
  });
  return deletedBook;
}
