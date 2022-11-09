const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json())




const uri = 'mongodb+srv://travelZoneDbUser:S4I6HvWqhKwyr0mk@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const countriesCollection = client.db('travelZoneDb').collection('travelCountries');
        
        app.get('/countries',async(req,res)=>{
        const query = {} ;
        const cursor = countriesCollection.find(query);
        const result= await cursor.toArray();
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