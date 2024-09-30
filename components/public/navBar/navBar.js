import React, { Component} from "react";
import Navlink from "./NavLink";
import styles from'../../../styles/Navstyles.module.css';
import Link from 'next/link';


export default class NavBar extends Component {   
    constructor(props) {
        super(props);
        this.state = {
          renderNav: false
        };
      }
    
    render(){  
        let Navcont = this.props.content;
        if(this.state.renderNav){
            this.state.renderNav = false;
            return (
                <div className={styles.NavBarLeftBack} id={"closingId"}  onClick={(event) => {
                    if(event.target.id == "closingId"){
                        this.setState({ renderNav: false})
                    }
                }}>
                    <nav className={styles.NavBarLeft} id="navbar">
                        <button onClick={() => this.setState({ renderNav: false})}>
                        Close Nav Menu
                        </button>
                        <div className={styles.NameDiv}>
                            <h2>Humboldt Gymnasium <br/> Eichwalde</h2>
                        </div>
                        <div className={styles.TableRow} onClick={() => this.setState({ renderNav: false})}>
                            <Link href="/" key={0} className={styles.NavLink}>
                                <div key={0}>
                                    <a className={styles.NavDivName}>Home</a>
                                </div>
                            </Link>
                        </div>
        
                        
                        {Navcont.map(elem => (
                            <Navlink items={[elem]}  cur={""} key={elem._id} Moke={false}></Navlink>
                        ))}
                    </nav> 
                </div>
            ) 
        }else{
            return (
                <nav className={styles.NavBarTop}>
                    <div onClick={() => this.setState({ renderNav: true})} className={styles.NavMenu}>
                        <a>Open Nav-Menu</a>
                    </div>
                    <Link href="/admin/LogIn" className={styles.Navlink}>
                        <div className={styles.AdminLogIn}> 
                            Log in as Admin
                        </div>
                    </Link>
                </nav>
            )
        }
    }
}