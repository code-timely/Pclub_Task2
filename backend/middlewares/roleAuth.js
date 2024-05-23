

const AdminRoleAuth = (req,res,next)=>{
    const role = req.user.role;
    if(role.localeCompare('admin')==0){
        next();
    }
    else{
        res.status(401).json({
            message: "Only admin can access content"
        });
    }
}

module.exports = AdminRoleAuth;