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

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        );
    }

    async create(att) {
        const records = await this.getAll();
        records.push(att);

        await this.writeAll(records);
    }

    async writeAll(att) {
        // second argument in JSON.stringify call is a custom formatter  
        // third argument designates the level of indentation
        await fs.promises.writeFile(this.filename, JSON.stringify(att, null, 2));
    }
}

const test = async () => {
    const repo = new UserRepo('users.json');
    // create function has a asynchronous nature, so we make sure that we also put the await keyword right in front of it.
    await repo.create({ email: 'petarfis@gmail.com', password: 'test12' });
    const users = await repo.getAll();

    console.log(users);
}

test();

