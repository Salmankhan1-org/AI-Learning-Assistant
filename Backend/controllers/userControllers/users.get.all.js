const { encryptData } = require("../../Encryption/encrypt.decrypt");
const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getAllUsers = catchAsyncError(
    async(req,res,next)=>{
        const allUsers = await User.find({});

        // const users = JSON.stringify(allUsers);

        // const encryptedData =  encryptData(users);


        res.status(200).json({
            message: 'All Users',
            success:true,
            data : allUsers
        })
    }
)