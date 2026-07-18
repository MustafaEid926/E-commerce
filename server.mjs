import express from 'express';

import routes from './routes/index.mjs'; 

const app = express();
app.use(express.json());
app.use(routes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} http://localhost:3000`);
});