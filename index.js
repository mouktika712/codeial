const express = require('express');
const app = express();

const port = 8000;

// use express router
app.use('/', require('./routes/index'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Something went wrong on the server side!`);
        console.log(`Error: ${err}`);
        return;
    }

    console.log(`Server is running on port: ${port} without any issues!!`);
})