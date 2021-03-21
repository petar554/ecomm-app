const express = require('express');
const bodyParser = require('body-parser');


const app = express();
// middleware - is going automatically detect whether or not we are using get or post request (not apply int he case of a get request!)
app.use(bodyParser.urlencoded({ extended: true }));

// req object represents incoming request from the browser into web server
// res represents outgoing response from server back to the browser
app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method='POST'>
                <input name='email' placeholder='email'/>
                <input name='password' placeholder='password'/>
                <input name='passwordConfirmation' placeholder='password confirmation'/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});
s
// middleware
/* const bodyParser = (req, res, next) => {
    if (req.method === POST) {
        req.on('data', data => {
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split('=');
                formData[key] = value;
            }
            req.body = formData;
            next();
        });
    } else {
        next();
    }
} */

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('acc created');
});

app.listen(3000, () => {
    console.log('listening')
});