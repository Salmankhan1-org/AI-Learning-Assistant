exports.GetRefreshToken = (req)=>{
    const refreshToken = req.cookies?.refreshToken;

    return refreshToken;
}