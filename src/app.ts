import express from 'express';
import {getAllPointsAltitudes} from './coordinates-puller';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  getAllPointsAltitudes();
  return console.log(`Express is listening at http://localhost:${port}`);
});
