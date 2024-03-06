//db
const express = require('express');
const cors = require('cors');
const routesUser = require('./router/routesUsers');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
// permet llegir contingut json en posts
app.use(express.json());

// cors necessari quan api/front son a servidors diferents
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// permet llegir les cookies
app.use(cookieParser());

// RoutesUser
app.use('/api', routesUser);

// iniciem servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
