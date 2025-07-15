const checkRole = (requiredRoles) => (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const hasRole = requiredRoles.some((role) => user.role === role);

  if (!hasRole) {
    return res
      .status(403)
      .json({ message: "Forbidden: You do not have the required role(s)" });
  }

  next();
};

export default checkRole;
