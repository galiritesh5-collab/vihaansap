// CRITICAL: dotenv.config() MUST be called FIRST before any other require()
// that loads firebase.js or any module that reads process.env on module load.
const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Node ENV: ${process.env.NODE_ENV}`);
  console.log(`Firebase Project ID: ${process.env.FIREBASE_PROJECT_ID || 'NOT SET - check Render env vars'}`);
});
