import express from 'express';
import router  from './src/routes/route.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
const app = express()
const port = 8000


app.use(cookieParser());

app.use('/public', express.static('public'));
app.use('/routes', express.static('routes'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Create multer instance with the defined storage
// export const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Handle POST requests to the '/upload' endpoint

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})