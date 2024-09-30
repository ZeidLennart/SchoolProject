import React, { Component } from 'react';
import styles from '../../../styles/Admin/addWindowStyle.module.css';
import ApiReq from '../../../db/ApiReq';


export default class addWindow extends Component {
    constructor(props){
        super(props)
        this.state = {
            active: this.props.active,
            zelltype: null,
            data: "",
        }
    }

    componentDidUpdate(){
        this.state.active = this.props.active;
    }

    create(){
        if(this.state.zelltype != null){
            if(this.props.liveEddit){
                ApiReq('/api/post/createLiveBlock', 'POST', {pageid: this.props.pageId,possml: [8,8,4,4] ,posmd:[12,12,5,5],posbig: [20,20,8,8],data: this.state.data ,zelltype: this.state.zelltype, Style: '{"borderRadius":"0","borderwidth":"0"}'}, true).then(res => {console.log(res)}).then(() => {
                    this.setState({active: false});
                    window.parent.location = window.parent.location.href;
                })
            }else{
                const itemid = Math.round(Math.random()*10000) + 10000
                ApiReq('/api/post/createNotLiveBlock', 'POST', {_id: itemid, pageid: this.props.pageId,possml: [8,8,4,4] ,posmd:[12,12,5,5],posbig: [20,20,8,8],data: this.state.data , zelltype: this.state.zelltype, newblock: true, Style: '{"borderRadius":"0","borderwidth":"0"}'}, true).then(res => {console.log(res)}).then(() => {
                    this.setState({active: false});
                    window.parent.location = window.parent.location.href;
                })
            }
        }
       
    }

    render() {
        if(this.state.active){
            return (
                <div className={styles.background}>   
                    <div className={styles.container}>
                        <h3>add block</h3>
                        <div className={styles.Choise}>
                         
                <div className={styles.button} onClick={event => this.setState({zelltype: "TEXTCELL", data:'{"Text": ""}'})}>
                    <a>TEXTCELL</a>
                </div>
                 
                <div className={styles.button} onClick={event => this.setState({zelltype: "Test", data:'{"Moke": "", "Sven": ""}'})}>
                    <a>Test</a>
                </div>
                 
                <div className={styles.button} onClick={event => this.setState({zelltype: "Header", data:'{"Title": "", "anotherTitle": ""}'})}>
                    <a>Header</a>
                </div>
                
                        </div>
                        <div className={styles.actionButtons}>
                            <div className={styles.button} onClick={event => this.setState({active: false})}>
                                <a>discard</a>
                            </div>
                            <div className={styles.button} onClick={event=> this.create()}>
                                <a>create</a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(<></>)
        }
    }
}
