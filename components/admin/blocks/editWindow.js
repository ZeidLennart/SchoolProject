
import React, { Component } from 'react';
import styles from '../../../styles/Admin/Boxes.module.css';
import ApiReq from '../../../db/ApiReq.js';
 
import TEXTCELL from './contentToLoad/TEXTCELL.js'; 
import Test from './contentToLoad/Test.js'; 
import Header from './contentToLoad/Header.js';

export default class editWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            active: true,
            input: this.props.item,
            screensize: this.props.screensize,
            zoom: 20,
            border: false,
            borderRadius: 0,
            borderwidth: 0,
            extras: [],
            contentObj: "",
                 
                    Text: "",
                    Moke: "",
                    Sven: "",
                    Title: "",
                    anotherTitle: "",
        }
        this.style = [];
        this.borderSettings;
        this.content = this.props.cont;
    }
    componentDidUpdate(){
        this.state.active = this.props.active;
    }

    save(){
    let Data;
        switch(this.props.item.zelltype) { 
            case "TEXTCELL": Data = `{"Text": "${this.state.Text}"}`; break;
            case "Test": Data = `{"Moke": "${this.state.Moke}", "Sven": "${this.state.Sven}"}`; break;
            case "Header": Data = `{"Title": "${this.state.Title}", "anotherTitle": "${this.state.anotherTitle}"}`; break;
            default:
            console.log("This kind of block does not exist{this.props.item.zelltype}")
        }
        const Style=`{"borderRadius": ${this.style[0]}, "borderwidth": ${this.style[1]}}`
        if(this.props.live){
            ApiReq('/api/put/updateLiveBlockData', 'PUT', { Data: Data, Style: Style, itemid: this.state.input._id}, true).then(respo => {console.log(respo);this.reload()})
        }else{
            if(this.state.input.newblock){
                ApiReq('/api/put/updateNotLiveBlockData', 'PUT', { Data: Data, Style: Style, itemid: this.state.input._id}, true).then(respo => {console.log(respo);this.reload()})
            }else{
                if(this.state.input.newblock != undefined){
                    ApiReq('/api/put/updateNotLiveBlockData', 'PUT', { Data: Data, Style: Style, itemid: this.state.input._id}, true).then(respo => {console.log(respo);this.reload()})
                }else{
                    ApiReq('/api/post/createNotLiveBlock', 'POST', {_id: this.state.input._id, pageid: this.state.input.pageid, possml: this.state.input.possml, posmd: this.state.input.posmd, posbig: this.state.input.posbig, data: Data, zelltype: this.state.input.zelltype, Style: Style, newblock: false}, true).then(respo => {console.log(respo);this.reload()})
                }
                if(this.state.input.newBlock){}
            }
        }  
    }

    reload(){
        this.setState({active:false})
        window.parent.location = window.parent.location.href;
    }

    delete(){
        if(this.props.live){
            ApiReq('/api/delete/deleteLiveItem', 'DELETE', {ItemId: this.state.input._id}, true).then(respo => {console.log(respo);})
            ApiReq('/api/delete/deleteNotLiveItem', 'DELETE', {ItemId: this.state.input._id}, true).then(respo => {console.log(respo); this.reload()})
        }else{
            if(this.state.input.newblock){
                ApiReq('/api/delete/deleteNotLiveItem', 'DELETE', {ItemId: this.state.input._id}, true).then(respo => {console.log(respo);this.reload()})
            }else{
                if(this.state.input.newblock != undefined){
                    ApiReq('/api/put/updateNotLiveBlockExistens', 'PUT', {Data: "!!DELETET!!",itemid: this.state.input._id}, true).then(respo => {console.log(respo);this.reload()})
                }else{
                    ApiReq('/api/post/createNotLiveBlock', 'POST', {_id: this.state.input._id, pageid: this.state.input.pageid, possml: [], posmd: [], posbig: [], data: "!!DELETET!!", zelltype: "", newblock: false}, true).then(respo => {console.log(respo);this.reload()})
                }
                if(this.state.input.newBlock){}
            }
        }
    }
    borderChange(){
        if(this.state.border){
            this.style[0] = this.state.borderRadius;
            this.style[1] = this.state.borderwidth;

            this.borderSettings = <>
                <div className={styles.inputRange}>
                    <h5>border-radius: </h5>
                    <input type="range" min="0" max="50" value={this.state.borderRadius} onChange={event => this.setState({borderRadius: event.target.value})}></input>
                    <a>{this.state.borderRadius}</a>
                </div>
                <div className={styles.inputRange}>
                    <h5>border-thickness: </h5>
                    <input type="range" min="0" max="9" value={this.state.borderwidth} onChange={event => this.setState({borderwidth: event.target.value})}></input>
                    <a>{this.state.borderwidth}</a>
                </div>
            </>
        }else{this.borderSettings = <></>;  this.style[0] = 0; this.style[1] = 0;}     
    }

    dataChange(event){
        const targ = event.target;
        const name = targ.name;
        const value = targ.value;
        let DATAOBJEKT = JSON.parse(this.state.contentObj);
        DATAOBJEKT[name] = value;
        this.setState({[name]: value, contentObj: JSON.stringify(DATAOBJEKT)})
    }

    componentDidMount(){
        let DATAOBJEKT = this.props.item.data  
        let realObj = JSON.parse(DATAOBJEKT)
        const Try = "Text"
        console.log(realObj[Try]);
        switch(this.props.item.zelltype) { 
            case "TEXTCELL": this.setState({contentObj: DATAOBJEKT ,  Text: realObj.Text}) ; break;
            case "Test": this.setState({contentObj: DATAOBJEKT ,  Moke: realObj.Moke,  Sven: realObj.Sven}) ; break;
            case "Header": this.setState({contentObj: DATAOBJEKT ,  Title: realObj.Title,  anotherTitle: realObj.anotherTitle}) ; break;
            default:
            console.log("This kind of block does not exist{this.props.item.zelltype}")
        }
        if(this.props.style != "" && this.props.style != null){
            if(this.props.style.borderRadius > 0 || this.props.style.borderwidth > 0){
                this.setState({border: true, borderRadius: this.props.style.borderRadius, borderwidth :this.props.style.borderwidth})
            }
        }
        console.log(this.props)

    }

    render() {
        this.borderChange();
        let Blockcontent, InputFields;
        switch(this.props.item.zelltype) {  
            case "TEXTCELL": Blockcontent = <TEXTCELL Data={this.state.contentObj} />; InputFields = <> <div className={styles.input}> <h3>Text</h3> <input type="text" name="Text" value={this.state.Text} onChange={event => {this.dataChange(event)}}></input> </div> </>; break; 
            case "Test": Blockcontent = <Test Data={this.state.contentObj} />; InputFields = <> <div className={styles.input}> <h3>Moke</h3> <input type="text" name="Moke" value={this.state.Moke} onChange={event => {this.dataChange(event)}}></input> </div> <div className={styles.input}> <h3>Sven</h3> <input type="text" name="Sven" value={this.state.Sven} onChange={event => {this.dataChange(event)}}></input> </div> </>; break; 
            case "Header": Blockcontent = <Header Data={this.state.contentObj} />; InputFields = <> <div className={styles.input}> <h3>Title</h3> <input type="text" name="Title" value={this.state.Title} onChange={event => {this.dataChange(event)}}></input> </div> <div className={styles.input}> <h3>anotherTitle</h3> <input type="text" name="anotherTitle" value={this.state.anotherTitle} onChange={event => {this.dataChange(event)}}></input> </div> </>; break; 
            default:
            console.log("This kind of block does not exist{this.props.item.zelltype}")
        }
        let previewwidth = 0, previewheigth = 0;
        if(this.state.screensize == 20){
            previewwidth = 2 * this.state.input.possml[3] * this.state.zoom * 10;
            previewheigth = 2 * this.state.input.possml[2] * this.state.zoom * 10;
        }else if(this.state.screensize == 40){
            previewwidth = 4 * this.state.input.posmd[3] * this.state.zoom * 5;
            previewheigth = 4 * this.state.input.posmd[2] * this.state.zoom * 5;
        }else if(this.state.screensize == 50){
            previewwidth = 5 * this.state.input.posbig[3] * this.state.zoom;
            previewheigth = 5 * this.state.input.posbig[2] * this.state.zoom;
        }

        if(this.state.active){
            let allstyles = "";
            this.style.map(elem => {allstyles = allstyles + elem})

            return (
                <div className={styles.edit_background}>
                    <div className={styles.edit_container}>
                        <h1>edit</h1>
                        <div className={styles.edit_main}>
                            <div className={styles.settingsBlock}>
                                <div className={styles.screensize}>
                                    <div>
                                        <h3>screensize</h3>
                                    </div>
                                    <div className={(this.state.screensize == 20) ? styles.activeScreepos : styles.screepos} onClick={event => this.setState({screensize: 20})}>
                                        <a>smal</a>
                                    </div>
                                    <div className={(this.state.screensize == 40) ? styles.activeScreepos : styles.screepos} onClick={event => this.setState({screensize: 40})}>
                                        <a>medium</a>
                                    </div>
                                    <div className={(this.state.screensize == 50) ? styles.activeScreepos : styles.screepos} onClick={event => this.setState({screensize: 50})}>
                                        <a>big</a>
                                    </div>
                                </div>
                                <div className={styles.inputCheckBox}>
                                    <h3>border: </h3>
                                    <input type="checkbox" checked={this.state.border} onChange={event => this.setState({border: !this.state.border})}></input>
                                </div>
                                {this.borderSettings}
                                {InputFields}
                            </div>  
                            <div className={styles.pre}>
                                <div className={styles.previewBlock}>
                                    <div className="preview">
                                        <style jsx>{`
                                            .preview { 
                                                width: ${previewwidth/100}rem;
                                                height: ${previewheigth/100}rem;
                                                border-radius: ${this.style[0]}%;
                                                border: 0.${this.style[1]}rem solid black;
                                                flex-direction: row;
                                                overflow-x: scroll;
                                                overflow-Y: scroll;
                                                flex-direction: row;
                                            }
                                        `}</style>
                                        {Blockcontent}
                                    </div>
                                </div>
                                <div className={styles.Zoom}>
                                        <a>Zoom: {this.state.zoom}</a> <a onClick={event => {if(this.state.zoom + 5 <= 100){this.setState({zoom: this.state.zoom + 5})}}}>+</a> <a onClick={event => {if(this.state.zoom - 5 >= 1){this.setState({zoom: this.state.zoom - 5})}}} >-</a>
                                </div>
                            </div>
                            
                        </div>
                        <div className={styles.edit_Buttons}>
                            <div className={styles.edit_discarButton}  onClick={event =>{this.setState({active: false})}}>
                                <a>discard</a>
                            </div>
                            <div className={styles.edit_deleteButton}  onClick={event =>{this.delete()}}>
                                <a>delete</a>
                            </div>
                            <div className={styles.edit_saveButton}  onClick={event =>{this.save()}}>
                                <a>save</a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return false;
        }
    }
}

