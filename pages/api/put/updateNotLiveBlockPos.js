const db = require("../../../db/index.js").instance;const bcrypt = require('bcrypt');const AdminHash = process.env.Admin_hash;
export default (req, res) => {
    bcrypt.compare(req.body.password || '', AdminHash).then((valid) => {if (valid){if (req.method === "PUT"){
            db.query("UPDATE NotLiveBlocks SET Possml = $1 , Posmd = $2, Posbig = $3 WHERE _id = $4",[req.body.Possml,req.body.Posmd,req.body.Posbig,req.body.itemid]).then(() => {res.send({"status": "success"});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "run"}));
        }}else{res.send({"status":"failed", "error":"No permission", "errorLevel": -1, "where": "permission"})};})
}