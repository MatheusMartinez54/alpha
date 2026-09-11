import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 3333;
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'alpha-api', timestamp: new Date().toISOString() }));
app.listen(port, () => console.log(`ALPHA API running on http://localhost:${port}`));
