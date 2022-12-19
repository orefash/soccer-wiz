const redis = require('../redis')

const logoutRedis = async (req, res, next) => {
  // console.log("in require local")
  try {
    const token = req.headers["x-auth-token"]

    console.log('token: ', token);

    if(!token) 
      return res.status(401);

    await redis.sadd("token-blacklist", token)

    next()
    
  } catch (error) {
    console.log('Error in logout: ', error.message)

    next(error)
  }
  
};

module.exports = logoutRedis;
