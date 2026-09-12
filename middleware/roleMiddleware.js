const adminMiddleware = (req, res, next) => {

  // Make sure user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  // Check admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  // User is admin
  next();
};

export default adminMiddleware;