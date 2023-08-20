const express = require('express');
const { connect } = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// connect to database
connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is up on port ${PORT}`);
    })
}).catch(err => {
    console.log(`ERROR connecting to the database`, err);
})
