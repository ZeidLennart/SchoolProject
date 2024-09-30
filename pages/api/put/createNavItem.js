const db = require("../../../db/index.js").instance;const bcrypt = require('bcrypt');const AdminHash = process.env.Admin_hash;
export default (req, res) => {
    bcrypt.compare(req.body.password || '', AdminHash).then((valid) => {if (valid){if (req.method === "PUT"){
            db.query("INSERT INTO NavBar (parentid, position, name, url) VALUES ($1, $2, $3, $4);",[req.body.parentId,req.body.position,req.body.name,req.body.url]).then(() => {res.send({"status": "success"});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "run"}));
        }}else{res.send({"status":"failed", "error":"No permission", "errorLevel": -1, "where": "permission"})};})
}