const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const Token = req.headers['token'];

  jwt.verify(Token, "SecretKey123456", (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: "Unauthorized" });
    } else {
      const email = decoded['data'];
      req.headers.email = email;
      next();
    }
  });
};
