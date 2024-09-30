import React, { Component } from 'react'
import styles from '../../../styles/Admin/adminNavstyles.module.css';
import Link from 'next/link';
import ApiReq from '../../../db/ApiReq'


export default class Navbar extends Component {
    constructor(props){
        super(props);
        this.state= {
            NavRows:[],
            key: 0,
            edditPopUp: null,
            newRowPopUp: null,
            inputUrl: "",
            inputPageName: "",
        };
    }

    collapse(event, data, parentId, key){
        const Rows = this.state.NavRows;
        Rows.length = key + 1;
        this.addNavRow(data, parentId);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value})
    }

    closePopUp(event){
        if(event.target.id == "popUp_background"){
            this.setState({ newRowPopUp: null, edditPopUp: null})
        }
    }

    saveNavData(event, item, data){
        let pageUrl = this.state.inputUrl.replace("/", " ")
        pageUrl = pageUrl.split(" ").join("");
        if(this.state.inputPageName == ""){
            document.getElementById("popUp_errorfield").innerHTML = "The page name was filled in automatically!"
            ApiReq('/api/put/updatenavitem', 'PUT', {itemName: item.name, itemUrl: pageUrl, itemId: item._id}, true).then(res => {console.log(res); this.setState({edditPopUp: null})});
        }else if(pageUrl == ""){
            document.getElementById("popUp_errorfield").innerHTML = "The page url was filled in automatically!"
            ApiReq('/api/put/updatenavitem', 'PUT', {itemName: this.state.inputPageName, itemUrl: item.url, itemId: item._id}, true).then(res => {console.log(res); this.setState({edditPopUp: null})});
        }else if(item.name == this.state.inputPageName && item.url == pageUrl){
            document.getElementById("popUp_errorfield").innerHTML = "No changes were made!"
        }else if(item.name != this.state.inputPageName || item.url != pageUrl){
            ApiReq('/api/put/updatenavitem', 'PUT', {itemName: this.state.inputPageName, itemUrl: pageUrl, itemId: item._id}, true).then(res => {console.log(res); this.setState({edditPopUp: null})});
        }else{
            document.getElementById("popUp_errorfield").innerHTML = "An error has occurred!"
        }
    }

    DeleteItem(event, item){
        if(item.children){
            if(item.children.length <= 0){
                ApiReq('/api/delete/deleteNavRow', 'DELETE', {ItemId: item._id}, true).then(res => {console.log(res); this.setState({newRowPopUp: null})});
            }else{
                ApiReq('/api/delete/deleteNavRow', 'DELETE', {ItemId: item._id}, true).then(res => {console.log(res), 
                    item.children.forEach(elem => {
                        this.DeleteItem("event", elem)
                    })
                });
            }
        }else{
            ApiReq('/api/delete/deleteNavRow', 'DELETE', {ItemId: item._id}, true).then(res => {console.log(res); this.setState({newRowPopUp: null})});
        }
        this.setState({ newRowPopUp: null, edditPopUp: null})

    }

    eddit(event, item, data){
        const PopUp = <div className={styles.popUp_background} id="popUp_background" onClick={event => this.closePopUp(event)}>
            <div className={styles.popUp_field} id="popUp_field">
                <div className={styles.popUp_Title}><h2>Edit</h2></div>
                <div className={styles.popUp_Errorfield}><h5 id="popUp_errorfield"></h5></div>
                <div className={styles.input}>
                    <h5>Page url</h5>
                    <input type="text" placeholder={item.url} name="inputUrl" id="inputUrl" onChange={event => this.handleInputChange(event)}/>
                </div>
                <div className={styles.input}>
                    <h5>Page name</h5>
                    <input type="text" placeholder={item.name} name="inputPageName" id="inputPageName" onChange={event => this.handleInputChange(event)}/>
                </div>
                <div className={styles.save_button} onClick={event => this.saveNavData(event, item, data)}>
                    <div>Save</div>
                </div>
                <div className={styles.save_button} onClick={event => this.DeleteItem(event, item)}>
                    <div>Delete</div>
                </div>
            </div>
        </div>
        this.setState({edditPopUp: PopUp})
    }

    addNavColum(event, parentId){
        console.log(parentId)
        const PopUp = <div className={styles.popUp_background} id="popUp_background" onClick={event => this.closePopUp(event)}>
            <div className={styles.popUp_field} id="popUp_field">
                <div className={styles.popUp_Title}><h2>Create New entry</h2></div>
                <div className={styles.popUp_Errorfield}><h5 id="newRow_errorfield"></h5></div>
                <div className={styles.input}>
                    <h5>Page url</h5>
                    <input type="text" placeholder="url" name="inputUrl" id="inputUrl" onChange={event => this.handleInputChange(event)}/>
                </div>
                <div className={styles.input}>
                    <h5>Page name</h5>
                    <input type="text" placeholder="name" name="inputPageName" id="inputPageName" onChange={event => this.handleInputChange(event)}/>
                </div>
                <div className={styles.save_button} onClick={event => this.saveNewRow(event, parentId)}>
                    <div>Save</div>
                </div>
            </div>
        </div>
        this.setState({newRowPopUp: PopUp})
    }

    saveNewRow(event, parentId){
        let pageUrl = this.state.inputUrl.replace("/", " ")
        pageUrl = pageUrl.split(" ").join("");
        if(this.state.inputPageName == ""){
            document.getElementById("newRow_errorfield").innerHTML = "No name was given!"
        }else if(pageUrl == ""){
            document.getElementById("newRow_errorfield").innerHTML = "No url was given!"
        }else{
            ApiReq('/api/put/createNavItem', 'PUT', {parentId: parentId, position: 7, name: this.state.inputPageName, url: pageUrl}, true).then(res => {console.log(res); this.setState({newRowPopUp: null})});
        }
    }

    addNavRow(data, parentId = 0) {
        const Rows = this.state.NavRows;
        let Colum = [];
        const key = this.state.key;
        data.map(item =>{
            if(item.children && item.children.length >= 1){
                Colum.push(                
                        <div key={item._id} className={styles.nav_Row} id={item._id} data-id={0}>
                            <Link href={item.url} key={item._id}> 
                                <div className={styles.page_name}>
                                    <a className={styles.nav_A_Tag}>{item.name}</a>
                                </div>
                            </Link>
                            <div className={styles.eddit} onClick={event => this.eddit(event, item, data)}>
                                <a>Edit</a>
                            </div>
                            <div className={styles.arrow}  onClick={event => this.collapse(event, item.children, item._id, key)}>
                                <a>{"==>"}</a>
                            </div>
                        </div>
                    )
            }else{
                Colum.push(                
                    <div key={item._id} className={styles.nav_Row} id={item._id} data-id={0}>
                            <Link href={item.url} key={item._id}> 
                                <div className={styles.page_name}>
                                    <a className={styles.nav_A_Tag}>{item.name}</a>
                                </div>
                            </Link>
                            <div className={styles.eddit} onClick={event => this.eddit(event, item, key)}>
                                <a>Edit</a>
                            </div>
                            <div className={styles.add_colum_button}  onClick={event => this.collapse(event, [], item._id, key)}>
                                <a>{"==++"}</a>
                            </div>
                        </div>)
            }
        })
        Colum.push(
            <div key="addButton" className={styles.add_button_row}>
                <div className={styles.add_button} onClick={event => {this.addNavColum(event, parentId)}}>
                    <a>+</a>
                </div>
            </div>
        )
        let newRow = <div className={styles.container} key={this.state.key}>{Colum.map(elem => {return(elem)})}</div>;
        Rows.push(newRow)
        
        this.setState({NavRows: Rows, key: this.state.key + 1, edditPopUp: <> </>})
    }


    componentDidMount(){
        this.addNavRow(this.props.Data);
    }



    render() {
        return (
            <div className={styles.innerContainer}>
                {this.state.NavRows.map(elem => {
                    return elem;
                })}
                {this.state.edditPopUp}
                {this.state.newRowPopUp}
            </div>
        )
    }
}



