const bcrypt = require('bcrypt');const AdminHash = process.env.Admin_hash;
export default (req,res) => {
    bcrypt.compare(req.body.password || '', AdminHash).then((valid) => {if (valid){
        res.send({"status":"success"});
    }else{res.send({"status":"failed", "error":"Wrong password"})}
})}