const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (!role) return res.status(403).json({ status: 'fail', message: 'You are not authorized!' });
    next();
};

module.exports = isAdmin;
