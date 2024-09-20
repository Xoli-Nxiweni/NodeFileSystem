const http = require('http');
const fs = require('fs');
const path = require('path');

// Set the file paths
const directoryPath = path.join(__dirname, 'data');
const filePath = path.join(directoryPath, 'db.json');

// Read the JSON file
const Read = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);  // Return the parsed JSON data
    }
    return { shoppingList: [] }; // Default structure if the file doesn't exist
};

// Write updated data to the JSON file
const Update = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
};

// Add a new item to the shopping list
const Create = (newItem) => {
    const data = Read();  // Read the current data from the file
    newItem.id = data.shoppingList.length + 1; // Generate new ID
    data.shoppingList.push(newItem);  // Add the new item
    Update(data);  // Write the updated data back to the file
    return newItem;
};

// Delete an item by ID from the shopping list
const Delete = (id) => {
    const data = Read();  // Read the current data
    const index = data.shoppingList.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedItem = data.shoppingList.splice(index, 1);  // Remove the item
        Update(data);  // Write the updated data back to the file
        return deletedItem;
    } else {
        return null;
    }
};

// HTTP server to handle CRUD operations
const server = http.createServer((req, res) => {
    if (req.url === '/shopping-list' && req.method === 'GET') {
        // GET: Retrieve shopping list
        const data = Read();  // Read from the file
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.shoppingList));
    } 
    else if (req.url === '/shopping-list' && req.method === 'POST') {
        // POST: Add new shopping list item
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newItem = JSON.parse(body);  // Parse the new item
            const addedItem = Create(newItem);  // Add the item to the list
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(addedItem));
        });
    } 
    else if (req.url.startsWith('/shopping-list/') && req.method === 'DELETE') {
        // DELETE: Remove item from the list
        const id = parseInt(req.url.split('/').pop());
        const deletedItem = Delete(id);
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

