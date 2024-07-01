const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json({extended: false}))


// Import routes
const indexRoute = (require('./routes/index'))
const apiRoute = (require('./routes/api'))


// Use Routes 
app.use('/', indexRoute)   // ------------Homepage
app.use('/api/hello', apiRoute)  // ------Api Endpoint

// 404 handler middleware
app.use((req, res, next) => {
    res.status(404).json({ 
        message: '404: Resource not found',
        navigateTo: `api/hello?visitor_name='mark'`,
        Req:'Get'
    });
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})