
## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EmmalynC27/cis435-project4.git
   cd cis435-project4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` file exists with MongoDB credentials:
   ```env
    MONGO_URL="mongodb+srv://WebTechUser:WVFOYMytzImV8EWW@umd-project4.u5gmxno.mongodb.net/?appName=UMD-Project4"
    MONGO_DB="UMD-Project4"
    PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
cis435-project4/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── main.js            # Frontend JavaScript
├── server.js          # Express server
├── src/
│   ├── db.js          # MongoDB connection
│   ├── models/
│   │   └── Recipe.js  # Recipe schema
│   └── routes/
│       └── recipes.js # API routes
├── package.json
└── .env              # Environment variables
```

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
