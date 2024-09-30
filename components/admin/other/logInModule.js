import React, { Component } from 'react'

export default class LogInModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Username: "",
          Password: "",
        };
        this.handleInputChange = this.handleInputChange.bind(this);
      }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      handleLogin(){
        fetch('../api/admin/verification', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({password: this.state.Password})
        }).then(res => res.json() ) .then(json => {
            if(json.status == "success"){
                this.setToken();
                document.getElementById("Errorfield").innerHTML = "";
            }else if(json.status == "failed"){
                document.getElementById("Errorfield").innerHTML = json.error;
                console.log(json);
            }else {
                console.log(json);
            }
        })
    };
    render() {
        return (
            <div className={styles.backgroundst}>
            <div className={styles.LogInWindow}>
                <div className={styles.Information}>
                    <h3>Humboldt Gymnasium <br /> Eichwalde </h3>
                    <h4>Admin Login</h4>
                    <h5 id="Errorfield"></h5>
                </div>                
                <div>
                    <form>
                        <div className={styles.Inputs}>
                            <h5>Password</h5>
                            <input type="password" placeholder="Password" name="Password" onChange={this.handleInputChange}/>
                        </div>
                        <div className={styles.ButtonChoise}>
                            <Link href="/"><div className={styles.Button}>Home</div></Link>
                            <div className={styles.Button} onClick={() =>  {
                                this.handleLogin();
                            }}>Login</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
