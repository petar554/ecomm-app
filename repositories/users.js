const fs = require('fs');
const crypto = require('crypto');
const util = require('util');


const scrypt = util.promisify(crypto.scrypt);

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
        // att === {email: '', password: ''}
        att.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(att.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...att,
            password: `${buf.toString('hex')}.${salt}}`
        };

        records.push(record);

        await this.writeAll(records);

        return record;
    }

    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
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

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);

        await this.writeAll(filteredRecords);
    }

    async update(id, att) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        //This is going to take all the different properties and key value pairs inside that att object and copy them one by one into the record object 
        Object.assign(record, att);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (filters[key] !== record[key]) {
                    found = false
                }
            }
            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UserRepo('users.json');
