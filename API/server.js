const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const userRoutes = require('./Routes/userRoutes');
const controllerRoutes = require('./Routes/controllers');

app.use('/user', userRoutes);
app.use('/', controllerRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Connection Test' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
