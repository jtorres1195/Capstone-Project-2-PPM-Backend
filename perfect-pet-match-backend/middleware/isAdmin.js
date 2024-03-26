
const isAdmin = (req, res, next) => {
    // Check if user is authenticated
    if(!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Unauthorized user. User does not have admin privileges'});
    }

    next();
};

module.exports = { isAdmin };