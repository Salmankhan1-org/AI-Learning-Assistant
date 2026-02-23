const { catchAsyncError } = require("../utils/catchAsyncError");
const crypto = require("crypto");


const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.CRYPTO_SECRET)
  .digest(); 

exports.encryptData = 
    (text) =>{
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);

        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");


        return {
            iv: iv.toString("hex"),
            encryptedData: encrypted
        };
    }
