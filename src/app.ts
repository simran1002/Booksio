import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.use(errorHandler);

export default app;
