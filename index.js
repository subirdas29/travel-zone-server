const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
//middlewares
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const countriesCollection = client.db('travelZoneDb').collection('travelCountries');
        
        app.get('/countries',async(req,res)=>{
        const query = {} ;
        const cursor = countriesCollection.find(query).limit(3);
        const result= await cursor.toArray();
        console.log(result)
        res.send(result);
        
        })

        app.get('/allcountries',async(req,res)=>{
            const query = {} ;
            const cursor = countriesCollection.find(query);
            const result= await cursor.toArray();
            console.log(result)
            res.send(result);
        })

       
        app.get('/services/allcountries/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)} ;
            const result = await countriesCollection.findOne(query);
            console.log(result)
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Travel Zone server is running')
})

app.listen(port,()=>{
    console.log(`Travel Zone server running on ${port}`);
})