const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');

const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for feedback page
app.get('/api/notes', (req, res) => {
    fs.promises.readFile('db/db.json')
    .then(data => { 
       res.send(data) 
    })
}
);

app.post('/api/notes', (req, res) => {
    const newNote = req.body
    newNote.id = uuidv4()
    fs.promises.readFile('db/db.json')
    .then(data => {
        const parsedData = JSON.parse(data)
        parsedData.push(newNote)
        return fs.promises.writeFile('db/db.json', JSON.stringify(parsedData))
    }).then(data => {
        res.json(data)
    })
}
  
);

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
