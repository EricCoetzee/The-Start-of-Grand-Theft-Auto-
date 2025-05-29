import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const app = express();

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure static assets with absolute paths



// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).send('Something broke!');
});
const port = 3000;
// Configure EJS and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/imgz', express.static(join(__dirname, 'imgz')));
app.use('/sounds', express.static(join(__dirname, 'sounds')));

// Route
app.get('/', (req, res) => {
  res.render('index');
});
// Ma
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});