// step 1: load required libraries and modules
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// step 2: configure PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// step 3: create an instance of the express server
const app = express();

// step 4: create a connection pool to the DB
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME || 'northwind',
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT) || 4,
    timezone: '+08:00'
});

// step 5: define a startup function to start the express server
const startApp = async (newApp, newPool) => {
    // Important.. at this moment, we don't know if the DB is accessible
    try {
        // try to get a connection
        const conn = await newPool.getConnection();

        // test that the connection obtained can be used
        console.info('We are pinging the database..');
        await conn.ping();

        // release connection after confirming that connection can be established
        conn.release();

        // after confirmation that the DB connection can be established, start the express server
        newApp.listen(PORT, () => {
            console.info(`Server was started at port ${PORT} on ${new Date()}`);
        });
    } catch (e) {
        console.error('=> Error occurred while establishing connection to DB: ', e);
    }
};

// step 6: define SQL queries
const SQL_QUERY_OBTAIN_ORDERS = 'select * from compute_orders where id=?';

const makeQuery = (sql, pool) => {
    console.log('=> Creating query:', sql);
    return (async (args) => {
        const conn = await pool.getConnection();
        try {
            let results = await conn.query(sql, args) || [];
            return results[0];
        } catch (e) {
            console.error(err);
        } finally {
            conn.release();
        }
    });
}

const retrieveOrders = makeQuery(SQL_QUERY_OBTAIN_ORDERS, pool);

// step 7: define middleware and any necessary routes
app.use(cors());
app.use(express.json());

app.get('/order/total/:order_id', (req, res, next) => {
    // do something with the parameter and return our reply
    const paramId = req.params['order_id'];
    console.info('=> paramId: ', paramId);

    retrieveOrders([paramId]).then(results => {
        res.format({
            html: () => {
                res.status(200).contentType('text/html');
                res.send(results);
            },
            json: () => {
                res.status(200).contentType('application/json');
                res.json(results);
            },
            default: () => {
                res.status(501).contentType('text/html');
                res.send('<h2>Requested type is not supported</h2>');
            }
        });
    });
});

app.use((req, res, next) => {
    res.redirect('/');
});

// step 8: start the server program
startApp(app, pool);
