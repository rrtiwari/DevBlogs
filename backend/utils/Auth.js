const requireAuth = (req, res, next) => {
  if (!req.session.userid) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Please login first",
    });
  }
  next();
};

const checkAuth = (req, res, next) => {
  res.locals.isAuthenticated = req.session.userid ? true : false;
  next();
};

module.exports = { requireAuth, checkAuth };
