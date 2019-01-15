require('dotenv').config({
  path: require('path').join(__dirname, '/.env')
})

module.exports = {
  jwt_encryption: process.env.JWT_ENCRYPTION || "meant_to_be_secret",
  jwt_expiration: Number.parseFloat(process.env.JWT_EXPIRATION) || 60 * 60,
  mongodb_uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cleiser",
}
