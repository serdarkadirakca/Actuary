module.exports = async (req,res,next)=>{
if(!req.session.isAdmin){
    return res.redirect("/restricted");
}
next();
};
