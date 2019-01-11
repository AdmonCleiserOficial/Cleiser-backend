require('dotenv').config()

module.exports = {
  jwt_encryption: process.env.JWT_ENCRYPTION || "meant_to_be_secret",
  jwt_expiration: process.env.JWT_EXPIRATION || 60 * 60,
  mongodb_uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cleiser",
}
