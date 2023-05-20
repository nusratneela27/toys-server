const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imrvi6v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        // const categoryCollection = client.db('toysDB').collection('category');

        // app.get('/category', async (req, res) => {
        //     const cursor = categoryCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        const teddyCollection = client.db('toysDB').collection('teddy');
        const dogCollection = client.db('toysDB').collection('dog');
        const catCollection = client.db('toysDB').collection('cat');

        const toyCollection = client.db('toysDB').collection('addToy');


        // Creating index on two fields
        const indexKeys = { toyName: 1, category: 1 }; // Replace field1 and field2 with your actual field names
        const indexOptions = { name: "toyCategory" }; // Replace index_name with the desired index name

        const result = await toyCollection.createIndex(indexKeys, indexOptions);

        app.get('/toyNameBySearch/:text', async (req, res) => {
            const searchText = req.params.text;

            const result = await toyCollection.find({
                toyName: { $regex: searchText, $options: "i" }
                // $or: [
                //     { toyName: { $regex: searchText, $options: "i" } },
                //     { category: { $regex: searchText, $options: "i" } }
                // ],
            }).toArray();

            res.send(result)
        })


        app.get('/teddy', async (req, res) => {
            const cursor = teddyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/dog', async (req, res) => {
            const cursor = dogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/cat', async (req, res) => {
            const cursor = catCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/teddy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, img: 1 },
            };

            const result = await teddyCollection.findOne(query, options)
            res.send(result)
        })

        app.get('/dog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, img: 1 },
            };

            const result = await dogCollection.findOne(query, options)
            res.send(result)
        })

        app.get('/cat/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, img: 1 },
            };

            const result = await catCollection.findOne(query, options)
            res.send(result)
        })

        // add toy
        app.post('/addToy', async (req, res) => {
            const add = req.body;
            const result = await toyCollection.insertOne(add);
            res.send(result)
        });

        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find({}).toArray();
            res.send(result);
        });

        app.get('/myToys/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await toyCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toys project is running')
})

app.listen(port, () => {
    console.log(`Toys projects is running on port: ${port}`);
})