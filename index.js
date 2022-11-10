const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
//middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const countriesCollection = client.db('travelZoneDb').collection('travelCountries');
        const reviewCollection = client.db('travelZoneDb').collection('allReviews');
        
        app.get('/countries',async(req,res)=>{
        const query = {} ;
        const cursor = countriesCollection.find(query).limit(3);
        const result= await cursor.toArray();
       
        res.send(result);
        
        })

        app.post('/reviews',async(req,res)=>{
            const review = req.body
            const result =await reviewCollection.insertOne(review)
            
            res.send(result);
        })

        app.get('/allcountries',async(req,res)=>{
            const query = {} ;
            const cursor = countriesCollection.find(query);
            const result= await cursor.toArray();
            
            res.send(result);
        })
        app.get('/reviews',async(req,res)=>{

            console.log(req.query)
            let query = {}; 
            if(req.query.email)
            {
                query ={
                    email:req.query.email
                }
            }
            const cursor= reviewCollection.find(query).sort({"updatedAt":-1});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })


       
        app.get('/services/allcountries/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)} ;
            const result = await countriesCollection.findOne(query);
            res.send(result);
        })

        
       
        
        app.get('/reviews/:id',async(req,res)=>{
            const id = req.params.id
            const query = {service:(id)}; 
           
            const cursor= reviewCollection.find(query).sort({"updatedAt":-1});
            const result = await cursor.toArray();
            console.log(result)
            res.send(result);
        })

        
        app.get('/allreviews',async(req,res)=>{

            const query = {} ;
            const cursor = reviewCollection.find(query);
            const result= await cursor.toArray();
            
            res.send(result);
        })

        app.get('/allreviews/:id',async(req,res)=>{
          
            const id = req.params.id
            const query = {_id:(ObjectId(id))}; 
           
            const result = await reviewCollection.findOne(query);
           
            console.log(result)
            res.send(result);
        })
        
        


        app.put('/allreviews/:id',async(req,res)=>{
            const id=req.params.id;
            const query = {_id:(ObjectId(id))}; 
            const updated= req.body;
            const option = {upsert:true}

            const updatedReview ={
                $set:{
                    text:updated.text,
                    updatedAt: new Date()
                }
            }

            const result =await reviewCollection.updateOne(query,updatedReview,option)
            res.send(result);
            console.log(result)
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