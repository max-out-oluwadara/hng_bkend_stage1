const express = require('express');
const router = express.Router();

// GET request to the root URL ('/')
router.get('/', (req, res) => {
  res.send('Hello World');
});

router.post('/', (req, res) => {
    // Extract name from the request body
    const {name} = req.body
    
    if (name) {
        console.log(req.body);
        // Generate a redirect URL with 'visitor_name' as a query parameter
        const redirectUrl = `/api/hello?visitor_name=${encodeURIComponent(name)}`;
        res.redirect(302, redirectUrl);
    } else {
        return res.status(400).json({ error: 'Name is required' });
    }
    
})

module.exports = router;
