const db = require("../../../db/index.js").instance;const bcrypt = require('bcrypt');const AdminHash = process.env.Admin_hash;
export default (req, res) => {
    bcrypt.compare(req.body.password || '', AdminHash).then((valid) => {if (valid){if (req.method === "POST"){
            db.query("SELECT * FROM NotLiveBlocks WHERE Pageid = $1;",[req.body.Pageid]).then(result => {res.send({"status": "success", "content":{"count": result.rowCount, "rows":result.rows,}});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "return"}));
        }}else{res.send({"status":"failed", "error":"No permission", "errorLevel": -1, "where": "permission"})};})
}