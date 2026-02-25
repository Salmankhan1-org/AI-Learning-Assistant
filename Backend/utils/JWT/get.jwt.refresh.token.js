exports.GetRefreshToken = ()=>{
    const refreshToken = req.cookies?.refreshToken;

    return refreshToken;
}