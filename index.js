const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('config');
const db = require('./models');
const { installHandler } = require('./graphql-handler');
const routes = require('./routes');

const app = express();
app.use(morgan('tiny'));
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
    console.log('Server running in production mode');
} else {
    console.log('Server running in development mode');
}
//ping
app.use('/api/ping', (req, res) => res.send('pong\n'));
//mount auth
app.use('/api/auth', routes.auth);
//mount graphql
installHandler(app);

db.sequelize
    .sync({
        force: false,
    })
    .then(() => {
        console.log('connect db success.');

        app.listen(config.get('port'), e => {
            if (!e) {
                console.log(`Server is running on port ${config.get('port')}`);
            }
        });
    })
    .catch(err => {
        console.log(err.message);
        process.exit();
    });
