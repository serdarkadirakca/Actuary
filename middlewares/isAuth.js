module.exports = async (req,res,next)=>{
if(!req.session.name){
    res.redirect("/");
}
next();
};
