// Create web server for comments
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Read comments from file
function readComments() {
  const comments = fs.readFileSync('./comments.json');
  return JSON.parse(comments);
}

// Write comments to file
function writeComments(comments) {
  fs.writeFileSync('./comments.json', JSON.stringify(comments));
}

// Get all comments
app.get('/api/comments', (req, res) => {
  res.send(readComments());
});

// Get a comment by id
app.get('/api/comments/:id', (req, res) => {
  const comments = readComments();
  const comment = comments.find((c) => c.id === parseInt(req.params.id));
  if (!comment) res.status(404).send('The comment is not found');
  res.send(comment);
});

// Create a comment
app.post('/api/comments', (req, res) => {
  const comments = readComments();
  const comment = {
    id: comments.length + 1,
    name: req.body.name,
    comment: req.body.comment,
  };
  comments.push(comment);
  writeComments(comments);
  res.send(comments);
});

// Update a comment
app.put('/api/comments/:id', (req, res) => {
  const comments = readComments();
  const comment = comments.find((c) => c.id === parseInt(req.params.id));
  if (!comment) res.status(404).send('The comment is not found');

  comment.name = req.body.name;
  comment.comment = req.body.comment;
  writeComments(comments);
  res.send(comments);
});

// Delete a comment
app.delete('/api/comments/:id', (req, res) => {
  const comments = readComments();
  const comment = comments.find((c) => c.id === parseInt(req.params.id));
  if (!comment) res.status(404).send('The comment is not found');

  const index = comments.indexOf(comment);
  comments.splice(index, 1);
  writeComments(comments);
  res.send(comments);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
