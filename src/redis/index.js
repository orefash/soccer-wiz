const Redis = require('ioredis');

const isProduction = process.env.NODE_ENV === 'production';

let redis_url = null;
if(isProduction)
    redis_url = process.env.REDIS_URL_PROD
else
    redis_url = process.env.REDIS_URL_DEV

let redis = null;

try {
    redis = new Redis(redis_url);
} catch (error) {
    console.log('Redis Error: ', error.message)
}


module.exports = redis;