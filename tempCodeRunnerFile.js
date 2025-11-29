const morgan = require('morgan');
const express = require('express');
const app = express();

const node = require('./Routes/node')
const user = require("./Routes/user");

const auth = require('./middleware/auth');
const notFound = require ('./middleware/notFound');
const cors = require('./middleware/cors');

app.use(cors);
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('NodeJS'));

const index = require('./middleware/index');

app.get('/', index);
app.use("/user", user);
app.use("/node", auth, node);
app.use(notFound);

app.listen(process.env.PORT || 3000, () => { 
    console.log("Server is running in port 3000");
});
