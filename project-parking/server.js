const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const parkirRoutes = require('./routes/parkir');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(bodyParser.json());
app.use('/api/parkir', parkirRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

