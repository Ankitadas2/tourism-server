const express=require('express')
const { MongoClient } = require('mongodb');

require('dotenv').config()
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const app=express()
const port=process.env.PORT|| 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ypl1e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect()
        
        const database=client.db('store')
        const storeCollection=database.collection('service')
        const orderCollection=database.collection('orders')
        const customerCollection=database.collection('customer')

        // get services api:
        app.get('/services',async(req,res)=>{
            const cursor=storeCollection.find({})
           const service=await cursor.toArray();
            res.send(service)
        })

        // get single service api:
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const services=await storeCollection.findOne(query)
            res.json(services)
        })
        
        // // add services data api:
        app.post('/services',async(req,res)=>{
            const newService=req.body;
            const result=await storeCollection.insertOne(newService);
            res.json(result);
        })
// add order service:
app.post("/addOrder",async(req,res)=>{
    const newOrder=req.body;
    console.log(newOrder)
    const detail=await orderCollection.insertOne(newOrder)
    res.send(detail)
})
app.get("/myOrders/:email",async(req,res)=>{
    const result=await orderCollection.find({email:req.params.email}).toArray();
    res.json(result)
})
// get api for manage orders:
app.get('/myOrders',async(req,res)=>{
    const cursor=orderCollection.find({});
    // console.log(cursor)
    const orders=await cursor.toArray();
    res.json(orders)
})
// Customers details for orders:
app.post('/newOrder',async(req,res)=>{
    const order=req.body;
    const result=await customerCollection.insertOne(order)
    res.json(result)
})
// Deleting process for my orders:
app.delete('/myOrders/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:(id)};
    const result=await orderCollection.deleteOne(query)
    res.json(result)
})
// Update order status:
app.put("/update/:id",async(req,res)=>{
    const id=req.params.id;
    const updatedInfo=req.body;
    // console.log(updatedInfo)
    const filter={_id:ObjectId(id)}
    // console.log(filter)
    const updatedDoc={
        $set:{
            status:updatedInfo.approved
        }
        
    }
    // console.log(updatedDoc)
   const result=await orderCollection.updateOne(filter,updatedDoc)
   res.send(result)
})


    }
    finally{

    }
}
run().catch(console.dir);









app.get('/',(req,res)=>{
    res.send('hello traveller')
})
app.get('/hello',(req,res)=>{
    res.send('new')
})

app.listen(port,()=>{
    console.log("running the port",port)
})