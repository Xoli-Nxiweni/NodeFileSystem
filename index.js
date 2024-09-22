const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// Set the file paths
const directoryPath = path.join(__dirname, 'data');
const filePath = path.join(directoryPath, 'db.json');

// Read the JSON file asynchronously
const Read = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { shoppingList: [] };
    }
};

// Write or update the JSON file asynchronously
const Update = async (data) => {
    await fs.mkdir(directoryPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), 'utf-8');
};

// Add a new item to the shopping list
const Create = async (newItem) => {
    const data = await Read();
    newItem.id = data.shoppingList.length + 1;
    data.shoppingList.push(newItem);
    await Update(data);
    return newItem;
};

// Delete an item by ID from the shopping list
const Delete = async (id) => {
    const data = await Read();
    const index = data.shoppingList.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedItem = data.shoppingList.splice(index, 1);
        await Update(data);
        return deletedItem;
    } else {
        return null;
    }
};

// HTTP server to handle CRUD operations
const server = http.createServer(async (req, res) => {
    if (req.url === '/shopping-list' && req.method === 'GET') {
        const data = await Read();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.shoppingList));
    } 
    else if (req.url === '/shopping-list' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const newItem = JSON.parse(body);
            const addedItem = await Create(newItem);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(addedItem));
        });
    } 
    else if (req.url.startsWith('/shopping-list/') && req.method === 'DELETE') {
        const id = parseInt(req.url.split('/').pop());
        const deletedItem = await Delete(id);
        if (deletedItem) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedItem));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item not found' }));
        }
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});