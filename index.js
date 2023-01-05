const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('bubu form node')
})
const verifyJWT = (req,res,next)=>{
  const auth = req.headers.authorization
  if(!auth){
    return res.status(401).send({message:'Unauthorized access'})
  }
  const token = auth.split(' ')[1]
  jwt.verify(token,process.env.Access_Token,function(err,decoded){
    if(err){
      return res.status(403).send({message:'forbidden'})
    }
    req.decoded = decoded
    next()
  })
}

// mongodb
const client = new MongoClient(process.env.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  const run = async()=>{
      try{
        const productsCollection = client.db("ecommerceReplciq").collection("products");
        const usersCollection = client.db("ecommerceReplciq").collection("users");

        app.post('/register',async(req,res)=>{
          const user = req.body
         
          const query = {phone:user.phone}
          const existingUser = await usersCollection.findOne(query)
          if(existingUser){
              return res.status(302).send({message:'already exist'})
          }
          const result = await usersCollection.insertOne(user)
          console.log(result)
          res.send(result)
      })

      app.put('/login',async(req,res)=>{
        const user = req.body
       
        const query = {phone:user.phone,password:user.password}
        const matchedUser = await usersCollection.findOne(query)
        if(matchedUser){
          const token = jwt.sign({phone:matchedUser.phone},
            process.env.Access_Token,
            { expiresIn: "1d" }
          );
            return res.send({token})
        }
        res.status(400).send({message:'invalid credential'})
    })
      app.get('/auth',verifyJWT,async(req,res)=>{
        const user = req.decoded
        const query = {phone:user.phone}
        const storedUser = await usersCollection.findOne(query)
        if(!storedUser){
          return res.status(401).send({message:'unauthorized access',status:false})
        }
        res.send({status:true})
        
    })
      }
      
      finally{}
  }
  run().catch(console.dir)










app.listen(port,()=>{
    console.log(`listening form ${port}`)
})