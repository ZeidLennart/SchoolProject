const db = require("../../../db/index.js").instance;const bcrypt = require('bcrypt');const AdminHash = process.env.Admin_hash;
export default (req, res) => {
    bcrypt.compare(req.body.password || '', AdminHash).then((valid) => {if (valid){if (req.method === "POST"){
            db.query("INSERT INTO NotLiveBlocks (_id ,Pageid, Possml, Posmd, Posbig, Data, Zelltype, NewBlock, Style ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",[req.body._id,req.body.pageid,req.body.possml,req.body.posmd,req.body.posbig,req.body.data,req.body.zelltype,req.body.newblock,req.body.Style]).then(() => {res.send({"status": "success"});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "run"}));
        }}else{res.send({"status":"failed", "error":"No permission", "errorLevel": -1, "where": "permission"})};})
}