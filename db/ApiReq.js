
    export default function ApiReq(rout, method, content = {}, AdminReq = false) {
        let Token;
        let propsObj = {method: method, headers: { 'Content-Type': 'application/json;charset=utf-8'}}
        if(AdminReq){
            Token = JSON.parse(sessionStorage.getItem('token'));
            content.password = Token;
        }
        if(method.toUpperCase() !== "GET"){
            propsObj.body = JSON.stringify(content);
        }
    
        return(fetch(rout, propsObj 
        ).then(res => res.json() ) .then(json => {
        const response = json;
        if(response.status == "failed"){
            if(response.error == "No permission"){
            console.log("User has to Log In");
            }else{console.log(response)}
        }else if(response.status == "success"){
            console.log("Everything worked");
            return(response);
        }
        }).catch(err => {if(err == "TypeError: Die Netzwerkverbindung wurde unterbrochen."){console.log("Falsche Method")}else if(err == "SyntaxError: The string did not match the expected pattern."){console.log("Falsche rout mitgegeben");}else{console.log(err);}return(err); })   ) 
    }        