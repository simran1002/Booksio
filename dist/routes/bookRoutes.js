"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
router.post('/upload', authMiddleware_1.authMiddleware, bookController_1.uploadBooks);
router.get('/', bookController_1.getBooks);
router.get('/:id', bookController_1.getBookById);
router.put('/:id', authMiddleware_1.authMiddleware, bookController_1.updateBook);
router.delete('/:id', authMiddleware_1.authMiddleware, bookController_1.deleteBook);
exports.default = router;
