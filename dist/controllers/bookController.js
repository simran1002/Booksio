"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.uploadBooks = void 0;
const client_1 = require("@prisma/client");
const csvParser_1 = require("../utils/csvParser");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.uploadBooks = [
    upload.single('file'),
    async (req, res) => {
        const sellerId = req.user.userId;
        const books = await (0, csvParser_1.parseCSV)(req.file.path);
        const createdBooks = await prisma.book.createMany({
            data: books.map((book) => ({
                ...book,
                sellerId,
            })),
        });
        res.status(201).send(createdBooks);
    },
];
const getBooks = async (req, res) => {
    const books = await prisma.book.findMany();
    res.send(books);
};
exports.getBooks = getBooks;
const getBookById = async (req, res) => {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book)
        return res.status(404).send({ error: 'Book not found' });
    res.send(book);
};
exports.getBookById = getBookById;
const updateBook = async (req, res) => {
    const sellerId = req.user.userId;
    const { id } = req.params;
    const { title, author, price } = req.body;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book)
        return res.status(404).send({ error: 'Book not found' });
    if (book.sellerId !== sellerId)
        return res.status(403).send({ error: 'Access denied' });
    const updatedBook = await prisma.book.update({
        where: { id: parseInt(id) },
        data: { title, author, price },
    });
    res.send(updatedBook);
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    const sellerId = req.user.userId;
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book)
        return res.status(404).send({ error: 'Book not found' });
    if (book.sellerId !== sellerId)
        return res.status(403).send({ error: 'Access denied' });
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
};
exports.deleteBook = deleteBook;
