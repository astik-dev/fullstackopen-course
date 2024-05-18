const mongoose = require('mongoose')

let mode = null;

if (process.argv.length > 3) {
    mode = "add person";
} else if (process.argv.length == 3) {
    mode = "get persons";
} else if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}



const password = process.argv[2]

const url =
    `mongodb+srv://astik:${password}@cluster0.yvxblfh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
});

const Person = mongoose.model('Person', personSchema);



switch (mode) {

    case "add person":
        const personName = process.argv[3];
        const personPhone = process.argv[4];
        const person = new Person({
            name: personName,
            phone: personPhone,
        });
        person.save().then(result => {
            console.log(`added ${personName} number ${personPhone} to phonebook`)
            mongoose.connection.close()
        });
        break;
        
    case "get persons":
        console.log("phonebook:");
        Person.find({}).then(result => {
            result.forEach(({name, phone}) => {
                console.log(name, phone);
            })
            mongoose.connection.close()
        })
}
