const express = require("express"); // Get express
const morgan = require("morgan"); // Get morgan
const path = require("path"); // Get path
var debug = require('debug')('myapp:server'); // Get debug logger
 
const app = express(); // Create express app
 
app.use(morgan("dev")); // Setup morgan middleware
app.use(express.static(path.join(__dirname, "public"))); // Setup static files
 
const PORT = process.env.PORT || 3000; // Setup port

app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
 console.log(`Server listening on http://localhost:${PORT}`);
});