const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({ message: "Auth failed", success: false });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Auth failed", success: false });
    }
    jwt.verify(token, process.env.JWT_KEY || "medicare_secret_key_12345", (err, decode) => {
      if (err) {
        return res.status(200).send({ message: "Auth failed", success: false });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Auth failed", success: false });
  }
};
