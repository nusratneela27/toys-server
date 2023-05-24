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
        // await client.connect();

        const toyCollection = client.db('toysDB').collection('addToy');

        // Creating index on two fields
        const indexKeys = { toyName: 1, category: 1 }; // Replace field1 and field2 with your actual field names
        const indexOptions = { name: "toyCategory" }; // Replace index_name with the desired index name

        const result = await toyCollection.createIndex(indexKeys, indexOptions);



        // get all toy
        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find({}).limit(20).sort({ price: 1 }).toArray();
            res.send(result);
        });

        //get toy by single id
        app.get('/allToys/:id', async (req, res) => {
            const id = (req.params.id)
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        //get all toys by category
        app.get('/category/:text', async (req, res) => {
            if (req.params.text == "dog" || req.params.text == "cat" || req.params.text == "teddy") {
                const result = await toyCollection.find({ category: req.params.text }).toArray();
                res.send(result);
            }
        });

        // add toy
        app.post('/addToy', async (req, res) => {
            const add = req.body;
            const result = await toyCollection.insertOne(add);
            res.send(result)
        });

        //get toy by user email
        app.get('/myToys/:email', async (req, res) => {
            const query = { email: req.params.email }
            const result = await toyCollection.find(query).sort({ price: 1 }).toArray();
            res.send(result);
            // const result = await toyCollection.find({ email: req.params.email }).sort({ price: -1 }).toArray();
            // res.send(result);
        })

        // search by toy name
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

        //update toy
        app.put('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    price: body.price,
                    detail: body.detail,
                    quantity: body.quantity
                },
            };
            const result = await toyCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        //delete toy from database
        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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