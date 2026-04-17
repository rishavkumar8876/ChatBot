import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // Get token from Authorization header (Bearer <token>)
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
        req.user = decoded; // { id: userId, username: string }
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};

export default authMiddleware;
