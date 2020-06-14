const User = require('../models/user')
const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error({error:'Page Not Found'})
        }
        req.token = token       
        req.user = user         /// so as not to search for it again!!
        next()
    } catch (error) {
        res.status(401).send({ error: 'User Did Not Authenticate!' })   /// 401   Unauthorized error status
    }
}

module.exports = auth