/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`🚀  Bouncing Faces server ready at: http://localhost:${port}/`);
});
