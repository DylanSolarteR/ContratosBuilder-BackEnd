import jwt from "jsonwebtoken";

const API_SECRET_KEY =
  "d00bb28082b4919e4055bf207589c7eb5b7e865463a996fade07b954da88f5e3";

const extractUserFromToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        error: "Token JWT no encontrado en la cabecera de autorización",
      });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, API_SECRET_KEY);

    if (decodedToken.exp <= Date.now() / 1000) {
      return res.status(401).json({ error: "Token JWT expirado" });
    }
    req.user = {
      id: decodedToken.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token JWT inválido" });
  }
};

export default extractUserFromToken;
