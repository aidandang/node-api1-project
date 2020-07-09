const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());

let users = [];

// GET request
server.get('/api/users', (req, res) => {
  if (!users) {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." });
  } else {
    res.status(200).json({ users });
  }
})

// POST request
server.post('/api/users', (req, res) => {
  const newUser = { ...req.body };
  newUser.id = shortid.generate();

  if ((!newUser.name) || (!newUser.bio)) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  } else {
    users.push(newUser);
    if (users.find(user => user.id === newUser.id)) {
      res.status(201).json({ user: newUser })
    } else {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
  }
})

const PORT = 5000;
server.listen(PORT, () => console.log('API running on port:', 5000));