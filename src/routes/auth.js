const routes = require('express')();
const bodyParser = require('body-parser');
const users = require('../controllers/users');

routes.use(bodyParser.json());

routes.post('/login', users.verifyUser, users.generateJWT);

// routes.get('/signin', getCurrentUser = async (req, res) => {
//   res.send(await getUser(req));
// });

routes.get('/logout', users.clearJWToken);

routes.get('*', (req, res) => {
    res.status(404).send({
        error: 'Not found 404',
        message: 'Route does not exist',
    });
});

module.exports = routes;
