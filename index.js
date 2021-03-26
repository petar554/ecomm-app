const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');


const app = express();

// middleware - is going automatically detect whether or not we are using get or post request (not apply in the case of a get request!)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // this Keyes are array of strings (essentially the encryption keys that is going to be used to encrypt all that data)
    keys: ['sdjnkadnkjasbd']
}));


// req object represents incoming request from the browser into web server
// res represents outgoing response from server back to the browser
app.get('/signup', (req, res) => {
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

app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }
    if (password !== passwordConfirmation) {
        res.send('Passwords must match');
    }

    // create user in user repo
    const newUser = await usersRepo.create({ email, password });

    // the cookie session library adds exactly one additional property to the req object (req.session);
    // store the id of that user inside the users cookie
    // req.session - added by cookie session (req.session is a plain javascript object)
    req.session.userId = newUser.id;

    res.send('acc created');
});


app.get('/signout', (req, res) => {
    // if we want to sign out our user, we have to tell the browser to "forget" all the information that is stored inside their cookie.
    req.session = null;
    res.send('You are logged out');
});


app.get('/signin', (req, res) => {
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

app.post('/signin', async (req, res) => {
    // req.body is all the information that was entered into our form
    const { email, password, } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPassword) {
        return res.send('Invalid password');
    }

    res.session.userId = user.id
    res.send('You are signed in!');
});


app.listen(3000, () => {
    console.log('listening')
});