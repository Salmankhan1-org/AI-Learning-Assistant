exports.GetAccessToken = ()=>{
    const accessToken = req.cookies?.accessToken;

    return accessToken;
}