const express = require('express');

const app = express();
// req is object taht represent incoming request from the browser into web server
// res represents outgoing response form server back to the browser
app.get('/', (req, res) => {
    res.send('web dev');
});

app.listen(3000, () => {
    console.log('listening')
});