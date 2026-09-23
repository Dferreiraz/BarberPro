const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new Error("Token não fornecido")
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    throw new Error("Token inválido")
  }
}

module.exports = authMiddleware