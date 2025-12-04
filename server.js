import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToMongo } from './src/db.js';
import recipeRoutes from './src/routes/recipes.js';

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('.')); // Serve static files from root directory

// API Routes
app.use('/api', recipeRoutes);

// Server health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Database and Server Variables
const port = process.env.PORT;
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

console.log('Environment variables loaded:');
console.log('- PORT exists:', !!port);
console.log('- MONGO_URL exists:', !!url);
console.log('- MONGO_DB exists:', !!dbName);

// Connect to MongoDB Atlas and start server
console.log('Starting server...');
console.log('Port:', port);
console.log('Database:', dbName);

connectToMongo(url, dbName)
  .then(() => {
    console.log('Database connection successful, starting server...');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    console.error('Full error:', err.stack);
    process.exit(1);
  });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
