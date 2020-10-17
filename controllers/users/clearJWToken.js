const clearJWToken = (req, res) => {
    res.clearCookie('token' /*{ domain: process.env.COOKIE_DOMAIN }*/);
    res.json({ status: 'ok' });
};

module.exports = clearJWToken;
