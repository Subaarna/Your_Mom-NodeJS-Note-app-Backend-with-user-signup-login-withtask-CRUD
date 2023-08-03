const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://yourmom:yourmom123@cluster0.eyq0vku.mongodb.net/?retryWrites=true&w=majority";

async function databaseInstance() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        await client.db().command({ ping: 1 });

        console.log("Connected to MongoDB");

        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}

const clientPromise = databaseInstance();

function openCollection(collectionName) {
    return clientPromise.then(client => client.db("yourmom").collection(collectionName));
}

module.exports = openCollection;
