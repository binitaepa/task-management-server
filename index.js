const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware 
app.use(cors());
app.use(express.json());


// task-management
// nBC6N8gYogKrYasn

//mongodb 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://task-management:nBC6N8gYogKrYasn@cluster0.b2avmfb.mongodb.net/?retryWrites=true&w=majority";

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
        // Send a ping to confirm a successful connection


        const tasksCollection = client.db("taskManagementDB").collection("tasks");


        app.get("/alltasks", async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result);
        })
        app.get("/addtask", async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result);
        })

        app.get("/findmyonetask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })

        app.post("/addtask", async (req, res) => {
            const tasks = req.body;
            const result = await tasksCollection.insertOne(tasks);
            res.send(result);
        })

        app.delete("/deletetask/:id", async (req, res) => {
            const id = req.params.id;
           const query = {_id : new ObjectId(id)}
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        app.put("/updatetask/:id", async (req, res) => {
            const id = req.params.id;
            const updatetask = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            if(updatetask?.status){
                const updateDoc = {
                    $set: {
                        status: updatetask?.status,
                    },
                };
                const result = await tasksCollection.updateOne(filter, updateDoc, options);
              return  res.send(result)
            }
            const updateDoc = {
                $set: {
                    title: updatetask?.title,
                    details: updatetask?.details,
                },
            };
            const result = await tasksCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Task Server is comming ....");
})
app.listen(port, () => {
    console.log(`Task Server is running on port ${port}`);
})