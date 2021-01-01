const express = require('express');
const connectDB = require('./config/db');
const path = require('path')
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }))

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/uploads', require('./routes/api/uploadRouter'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started On Port 
${PORT}`))