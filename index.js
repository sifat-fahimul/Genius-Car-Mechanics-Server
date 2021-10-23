const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.fj83e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()

        const database = client.db('carMechanic')
        const serviceCollation = database.collection('services');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollation.find({})
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollation.findOne(query);
            res.json(service);
        })


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await serviceCollation.insertOne(service);
            console.log(result);
            res.json(result)
        })
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollation.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello from server')
});

app.listen(port, () => {
    console.log('running server on :', port);
})