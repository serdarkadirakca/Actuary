module.exports = async (req,res,next)=>{
if(!req.session.isManager){
    return res.redirect("/restricted");
}
next();
};
