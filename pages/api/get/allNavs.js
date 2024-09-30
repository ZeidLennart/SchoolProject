const db = require("../../../db/index.js").instance;
export default (req, res) => {
    if (req.method === "GET"){
            db.query("SELECT * FROM NavBar ORDER BY parentid ASC, position ASC;").then(result => {res.send({"status": "success", "content":{"count": result.rowCount, "rows":result.rows,}});}).catch(err => res.send({"status":"failed", "error":err, "errorLevel": 0, "where": "return"}));
        }
}