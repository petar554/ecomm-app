const fs = require('fs');

class UserRepo {
    // constructor functions get called instantly whenever we create a new instance of a class 
    constructor(filename) {
        // check if the file is added as a parameter
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;

        try {
            // check if the file exists on hard drive (https://nodejs.org/api/fs.html)
            fs.accessSync(this.filename);
        } catch (err) {
            // if the file does not exist we have to make it (https://nodejs.org/api/fs.html)
            fs.writeFileSync(this.filename, '[]');
        }
    }
}

const repo = new UserRepo('users.json');