const express = require('express');
const cors = require('cors');
const connection = require('./Database/Connection');

connection();

const app = express();
const port = 3900;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const projectRoutes = require('./Routes/Project');
app.use('/api/project', projectRoutes);

app.get("/prueba", (req, res) => {
  return res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});