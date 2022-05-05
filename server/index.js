const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const app = express();
app.use(cors());
app.use(bodyParser.json());

//Postgres Client setup

const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHOST,
    database: keys.pgDATABASE,
    password:keys.pgPASSWORD,
    port: keys.pgPORT
});
pgClient.on('error', () => console.log("Lost PG connection"));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch(err=>console.log(err));

const redisClient =redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=> 1000
});

console.log(redisClient);

const redisPublisher = redisClient.duplicate();


app.get('/',(req, res)=>{
    res.send('Hi');
});

app.get('/values/all',async(req,res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows)
});

app.get('/values/current', async (req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        console.log(values + "utga");
        res.send(values);
    });
});

app.post('/values', async (req,res)=>
{
    const index = req.body.index;

    if(parseInt(index)>40){
        return res.status(422).send("Index too high");
    }

    redisClient.hset('values',index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({working: true});

});

app.listen(5000, err=>{
    console.log('Listening');
})

// function fib(index) {
//     if(index<2) return 1;
//     return fib(index - 1) + fib(index - 2);
// }

// sub.on('message', (channel, message)=>{
//     redisClient.hset('values', message,fib(parseInt(message)));
// });
// sub.subscribe('insert');