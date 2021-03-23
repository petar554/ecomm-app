const fs = require('fs');
const crypto = require('crypto');


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
        att.id = this.randomId();

        const records = await this.getAll();
        records.push(att);

        await this.writeAll(records);
    }

    async writeAll(att) {
        // second argument in JSON.stringify call is a custom formatter  
        // third argument designates the level of indentation
        await fs.promises.writeFile(this.filename, JSON.stringify(att, null, 2));
    }

    randomId() {
        // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback 
        return crypto.randomBytes(4).toString('hex');
    }
}

const test = async () => {
    const repo = new UserRepo('users.json');
    // create function has a asynchronous nature, so we make sure that we also put the await keyword right in front of it.
    await repo.create({ email: 'belka12@gmail.com', password: 'hello' });
    const users = await repo.getAll();

    console.log(repo.randomId());
    console.log(users);
}

test();

