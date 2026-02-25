exports.GetUserId = (req)=>{
    const userId = req.user?._id;

    return userId;
}