const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({message:"No Token"})
    }

    const token = authHeader.split(" ")[1]
    try {
        const decode = jwt.verify(token, process.env.MY_SECRET_KEY)
        req.user = decode
        next()
    } catch(error) {
        return res.status(401).json({message: "Invalid token"})
    }
}

module.exports = {
    jwtAuth,
}
