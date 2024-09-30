const db = require("../../../db/index.js").instance;
export default (req, res) => {
    if (req.method === "POST"){
            db.query("SELECT * FROM Blocks WHERE Pageid = $1;",[req.body.Pageid]).then(result => {res.send({"status": "success", "content":{"count": result.rowCount, "rows":result.rows,}});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "return"}));
        }
}