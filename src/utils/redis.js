const redisClient = require('../db/redis-init');

const redisLookupURL = async (url) => {
    try {
        const result = await redisClient.getAsync("search:" + url);
        console.log("search:" + url);
        if (result) {
            return true
        }else return false

    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    redisLookupURL
};