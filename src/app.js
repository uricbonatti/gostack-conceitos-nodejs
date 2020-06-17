const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository Id.' });
  }
  return next();
}
app.use('/repositories/:id', validateRepositoryId);
app.get("/repositories", (request, response) => {
  // TODO
  const { title } = request.query;
  const filtereds = title ?
    repositories.filter(repository => repository.title.includes(title)) :
    repositories;
  return response.json(filtereds);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;
  if (title && url && Array.isArray(techs) && techs.length) {
    const repository = { id: uuid(), title, url, techs, likes: 0 };
    repositories.push(repository);
    return response.json(repository);
  }
  return response.status(400).json({ error: "Something is missing." });

});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const {id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'})
  }
  const { title, url, techs } = request.body;
  const { likes } = repositories[repositoryIndex];
  const repository = {
    id:id,
    title: title,
    url: url,
    techs: techs,
    likes: likes
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'})
  }
  const { title,url, techs, likes } = repositories[repositoryIndex];
  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes+1,
  }
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
