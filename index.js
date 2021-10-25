const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://mydbuser1:xxpsPPssvguolimn@cluster0.nsqce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("products");
        const userCollection = database.collection("users");

        //data send to client
        app.get('/addproducts', async (req, res) => {
            const cursor = userCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        app.get('/addproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await userCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(products);
        })

        //Update api

        app.put('/addproducts/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    price: updatedUser.price,
                    quantity: updatedUser.quantity
                },
            };

            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        //DELETE api 
        app.delete('/addproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        //data collect from client
        app.post('/addproducts', async (req, res) => {
            const addProducts = req.body;
            const result = await userCollection.insertOne(addProducts)
            res.send(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




// app.get('/', (req, res) => {
//     console.log("hittng the post", res)
//     res.send("yah!!! I can")
// });

// app.get('/addproducts', (req, res) => {

// })

app.listen(port, () => {
    console.log("running", port)
})