// Simple Node.js Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const PORT = 3000;
/*
// MongoDB connection
mongoose.connect('mongodb://localhost:3001/recipost') //Prev Port: 27017
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error:', err.message));

const Recipe = require('./models/Recipe');
*/
// Create server
const server = http.createServer(async (req, res) => {
    const url = req.url;
    const method = req.method;

    // Serve static files
    if (url === '/' || url === '/index.html') {
        serveFile('public/index.html', 'text/html', res);
    } else if (url === '/styles.css') {
        serveFile('public/styles.css', 'text/css', res);
    } else if (url === '/main.js') {
        serveFile('public/main.js', 'text/javascript', res);
    }

    // API: Get all recipes
    else if (url === '/api/recipes' && method === 'GET') {
        try {
            const recipes = await Recipe.find().sort({ createdAt: -1 });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(recipes));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        }
    }
    
    // API: Create recipe
    else if (url === '/api/recipes' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                console.log('Received body:', body);
                const data = JSON.parse(body);
                console.log('Parsed data:', data);
                const recipe = new Recipe(data);
                console.log('Created recipe model:', recipe);
                const saved = await recipe.save();
                console.log('Saved successfully:', saved);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(saved));
            } catch (err) {
                console.error('Error saving recipe:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: err.message }));
            }
        });
    }
    
    // API: Get one recipe
    else if (url.match(/^\/api\/recipes\/[a-zA-Z0-9]+$/) && method === 'GET') {
        const id = url.split('/')[3];
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(recipe));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        }
    }
    
    // API: Update recipe
    else if (url.match(/^\/api\/recipes\/[a-zA-Z0-9]+$/) && method === 'PUT') {
        const id = url.split('/')[3];
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true });
                if (!recipe) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Not found' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(recipe));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: err.message }));
            }
        });
    }
    
    // API: Delete recipe
    else if (url.match(/^\/api\/recipes\/[a-zA-Z0-9]+$/) && method === 'DELETE') {
        const id = url.split('/')[3];
        try {
            const recipe = await Recipe.findByIdAndDelete(id);
            if (!recipe) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Deleted' }));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        }
    }
    
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Helper function to serve files
function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading file');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
