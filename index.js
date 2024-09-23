const http = require('http');
const fs = require('fs');
const path = require('path');

// File paths and initialization
const directoryPath = path.join(__dirname, 'data');
const filePath = path.join(directoryPath, 'db.json');

// Ensures that the data directory and file are created if they do not exist
const initializeFile = () => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ shoppingList: [] }, null, 2), 'utf-8');
    }
};

// Helper functions
const readData = (callback) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return callback(err, { shoppingList: [] });
        try {
            const jsonData = data ? JSON.parse(data) : { shoppingList: [] };
            callback(null, jsonData);
        } catch (parseErr) {
            writeData({ shoppingList: [] }, (writeErr) => {
                if (writeErr) return callback(writeErr, { shoppingList: [] });
                callback(null, { shoppingList: [] });
            });
        }
    });
};

const writeData = (data, callback) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
        if (err) return callback(err);
        callback(null);
    });
};

// CRUD Operations
const addItem = (newItem, callback) => {
    readData((err, data) => {
        if (err) return callback(err);
        newItem.id = data.shoppingList.length + 1;
        data.shoppingList.push(newItem);
        writeData(data, (err) => callback(err, newItem));
    });
};

const updateItem = (id, updates, callback) => {
    readData((err, data) => {
        if (err) return callback(err);
        const index = data.shoppingList.findIndex(item => item.id === id);
        if (index === -1) return callback(null, null); // Item not found

        // Update the item with the new values
        const updatedItem = { ...data.shoppingList[index], ...updates };
        data.shoppingList[index] = updatedItem;

        // Write the updated list back to the file
        writeData(data, (writeErr) => {
            if (writeErr) return callback(writeErr);
            callback(null, updatedItem);
        });
    });
};

const deleteItem = (id, callback) => {
    readData((err, data) => {
        if (err) return callback(err);

        const index = data.shoppingList.findIndex(item => item.id === id);
        if (index === -1) return callback(null, null);

        const deletedItem = data.shoppingList.splice(index, 1)[0];

        writeData(data, (err) => callback(err, deletedItem));
    });
};

// Initialize the file at the start
initializeFile();

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/shopping-list' && req.method === 'GET') {
        // Fetch shopping list
        readData((err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error reading data' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data.shoppingList));
        });
    } else if (req.url === '/shopping-list' && req.method === 'POST') {
        // Add new item to the list
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newItem = JSON.parse(body);
            addItem(newItem, (err, addedItem) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Error saving item' }));
                }
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(addedItem));
            });
        });
    } else if (req.url.startsWith('/shopping-list/') && req.method === 'DELETE') {
        // Delete item from list by ID
        const id = parseInt(req.url.split('/').pop());
        deleteItem(id, (err, deletedItem) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error deleting item' }));
            }
            if (!deletedItem) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Item not found' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedItem));
        });
    } else if (req.url.startsWith('/shopping-list/') && req.method === 'PATCH') {
        // Update an existing item by ID
        const id = parseInt(req.url.split('/').pop());
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updates = JSON.parse(body);
            updateItem(id, updates, (err, updatedItem) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Error updating item' }));
                }
                if (!updatedItem) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Item not found' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedItem));
            });
        });
    } else {
        // Route not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

// Start the server
const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});