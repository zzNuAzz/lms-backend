const clearJWToken = (req, res) => {
    try {
        res.clearCookie('token' /*{ domain: process.env.COOKIE_DOMAIN }*/);
        res.json({ success: true });
    } catch {
        res.json({ success: false });
    }
};

module.exports = clearJWToken;
