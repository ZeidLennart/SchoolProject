
import React, { Component, useEffect } from 'react'; 
        import styles from '../../../styles/Admin/Boxes.module.css';
        import ApiReq from '../../../db/ApiReq.js';
        import EditWindow from './editWindow.js';        
         
import TEXTCELL from './contentToLoad/TEXTCELL.js'; 
import Test from './contentToLoad/Test.js'; 
import Header from './contentToLoad/Header.js';
        
        class Blackbox extends Component{
            constructor(props){
                super(props)
                this.Mous = {X: 0, Y: 0};
                this.offset = {X: 0, Y: 0};
                this.resziecorner = {X: 0, Y: 0}
                this.state = {
                    Pos:[],
                    input: this.props.content,
                    editWindow: false,
                    Content: "",
                    style:"",
                    styleTags: "",
                    active: false,
                };
                this.nogoArea = [];
                this.parent;
                this.stopResize = this.stopResize.bind(this);
                this.Resizing = this.Resizing.bind(this);
                this.deactivate = this.deactivate.bind(this);
        
            }
        
            onDrag(event){
                event.preventDefault();
                event.target.style.backgroundColor = document.body.style.backgroundColor;
                this.Mous.X = event.pageX;
                this.Mous.Y = event.pageY;
            }
        
            onDragStart(event){
                event.target.style.backgroundColor = "rgb(182, 212, 206)";
                this.offset.X = event.nativeEvent.offsetX;
                this.offset.Y = event.nativeEvent.offsetY;
            }
        
            OnDragEnd(event){
                const blocksize = Math.floor(window.innerWidth / this.props.screensize);
                const elemtopleftX = this.Mous.X + blocksize- this.offset.X;
                const elemtopleftY = this.Mous.Y + blocksize - this.offset.Y;
                const XPos = Math.floor(elemtopleftX / blocksize);
                const YPos = Math.floor(elemtopleftY / blocksize);
                let NoGo = false;
        
                this.nogoArea.map(elem => {
                    if(!NoGo){
                        let onTop = [-1,-1];
                        if(elem[0] <= 1){elem[0] = -100; onTop[0] = 100};
                        if(elem[1] <= 1){elem[1] = -100; onTop[1] = 100};
                        if(elem[1] <= XPos && XPos <= elem[1] + elem[2] + onTop[0] && elem[0] <= YPos && YPos <= elem[0] + elem[3] + onTop[1]){
                            NoGo = true;
                        }
                    }
                })
        
                if(!NoGo){
                    if(YPos <= 0){
                        if(XPos + this.state.Pos[3] > this.props.screensize){
                            this.state.Pos[0] = this.props.screensize - this.state.Pos[3] + 2;
                            this.state.Pos[1] = 1;
                        }else if(XPos <= 0){
                            this.state.Pos[0] = 1;
                            this.state.Pos[1] = 1;
                        }else{
                            this.state.Pos[0] = XPos;
                            this.state.Pos[1] = 1;
                        }
                    }else if(XPos + this.state.Pos[3] > this.props.screensize){
                        this.state.Pos[0] = this.props.screensize - this.state.Pos[3] + 2;
                        this.state.Pos[1] = YPos;
                    }else if(XPos <= 0){
                        this.state.Pos[0] = 1;
                        this.state.Pos[1] = YPos;
                    }else{
                        this.state.Pos[0] = XPos;
                        this.state.Pos[1] = YPos;
                    }
                    console.log(this.state.input)
                    if(this.props.liveEddit){
                        ApiReq('/api/put/updateLiveBlockPos', 'PUT', {Possml:this.state.input.possml , Posmd: this.state.input.posmd, Posbig: this.state.input.posbig, itemid: this.state.input._id}, true).then(respo => {console.log(respo);
                            this.forceUpdate();
                        })
                    }else{
                        if(!this.state.input.hasOwnProperty("newblock")){
                            let Objekt = this.state.input;
                            Objekt.newblock = false;
                            Objekt.Style = Objekt.style;
        
                            ApiReq('/api/post/createNotLiveBlock', 'POST', Objekt, true).then(respo => {console.log(respo);
                                this.forceUpdate();
                            })
                        }else{
                            ApiReq('/api/put/updateNotLiveBlockPos', 'PUT', {Possml:this.state.input.possml , Posmd: this.state.input.posmd, Posbig: this.state.input.posbig, itemid: this.state.input._id}, true).then(respo => {console.log(respo);
                                this.forceUpdate();
                            })
                        }
                    }
                }
            }
        
            resize(event){
                const element = event.target.parentElement;
                element.draggable = false;
                this.parent = element;
                window.addEventListener('mousemove', this.Resizing, false);
                window.addEventListener('mouseup', this.stopResize, false);
        
            }
        
            Resizing(e) {
                e.preventDefault();
                this.resziecorner.X = e.pageX;
                this.resziecorner.Y = e.pageY;
            }
        
            stopResize(e) { 
                window.removeEventListener('mousemove', this.Resizing);
                window.removeEventListener('mouseup', this.stopResize, false);
                let element = this.parent;
                this.parent = "";
        
                if(element != ""){
                    element.draggable = true;
                    const blocksize = Math.floor(window.innerWidth / this.props.screensize);
                    const elemtopleftX = this.resziecorner.X + blocksize;
                    const elemtopleftY = this.resziecorner.Y + blocksize;
                    const XPos = Math.floor(elemtopleftX / blocksize) - 2;
                    const YPos = Math.floor(elemtopleftY / blocksize) - 2;
                    this.state.active = true;

                    if(XPos <= 0 || XPos > this.props.screensize || YPos <= 0){
                        console.log("Rand überschritten.");
                    }else if(XPos < this.state.Pos[0]  || YPos < this.state.Pos[1] ){
                        console.log("Das Feld wär zu klein.")
                    }else{
                        this.state.Pos[3] = XPos - this.state.Pos[0] + 3;
                        this.state.Pos[2] = YPos - this.state.Pos[1] + 3;
                        if(this.props.liveEddit){
                            ApiReq('/api/put/updateLiveBlockPos', 'PUT', {Possml:this.state.input.possml , Posmd: this.state.input.posmd, Posbig: this.state.input.posbig, itemid: this.state.input._id}, true).then(respo => {console.log(respo);
                                this.forceUpdate();
                            })
                        }else{
                            if(!this.state.input.hasOwnProperty("newblock")){
                                let Objekt = this.state.input;
                                Objekt.newblock = false;
                                Objekt.Style = Objekt.style;
            
                                ApiReq('/api/post/createNotLiveBlock', 'POST', Objekt, true).then(respo => {console.log(respo);
                                    this.forceUpdate();
                                })
                            }else{
                                ApiReq('/api/put/updateNotLiveBlockPos', 'PUT', {Possml:this.state.input.possml , Posmd: this.state.input.posmd, Posbig: this.state.input.posbig, itemid: this.state.input._id}, true).then(respo => {console.log(respo);
                                    this.forceUpdate();
                                })
                            }
                        }
                    }
        
                }
            }
        
            EdditBlock(){
                let eddit = <EditWindow active={true} item={this.state.input} screensize={this.props.screensize} live={this.props.liveEddit} style={this.state.style}/>
                this.setState({editWindow: eddit})
            }
            componentDidMount(){
                console.log(this.state.input)
                if(this.state.input.data != ""){
                  let DATAOBJEKT = this.state.input.data
                  this.setState({Content: DATAOBJEKT}) 
                }
                if(this.state.input.style != "" && this.state.input.style != null){
                    const styleobjekt = JSON.parse(this.state.input.style)
                    const styleTags = `border-radius: ${styleobjekt.borderRadius}%; border: 0.${styleobjekt.borderwidth}rem solid black;`
                    this.setState({style: styleobjekt, styleTags: styleTags}) 
                }
            }
        
        
          GoLive(){
            this.setState({goLive: "Loading..."});
            let NotLiveBlocksres;
            ApiReq('/api/post/NotLiveData', 'POST', {Pageid: this.pageId}, true).then(res => {NotLiveBlocksres = res}).then(() => {
              if(NotLiveBlocksres.status == "success"){
                console.log(NotLiveBlocksres)
                if(NotLiveBlocksres.content.count > 0){   
                  let NotLiveBlocks = NotLiveBlocksres.content.rows
                  if(NotLiveBlocks[0].data == "!!DELETE!!"){
                    this.deleteLiveBlock(NotLiveBlocks, 0);
                  }else if(NotLiveBlocks[0].newblock){
                    this.createLiveBlock(NotLiveBlocks, 0);
                  }else if(!NotLiveBlocks[0].newblock){
                    this.updateLiveBlock(NotLiveBlocks, 0);
                  }
                }else{
                  this.setState({goLive: "Nothing to Update"});
                }
              }
            })
          }
        
          deleteLiveBlock(array, index){
            console.log("delete")
        
            ApiReq('/api/delete/deleteLiveItem', 'POST', {ItemId: array[index._id]}, true).then(res => {console.log(res);
              if(array.length > index + 1){
                if(array[index + 1].data == "!!DELETE!!"){
                  this.deleteLiveBlock(array, index+1);
                }else if(array[index + 1].newblock){
                  this.createLiveBlock(array, index+1);
                }else if(!array[index + 1].newblock){
                  this.updateLiveBlock(array, index+1);
                }
              }else{
                ApiReq('/api/delete/updateWholeLiveBlock', 'DELETE', {pageId: this.pageid}, true).then(res => {console.log(res);
                  this.setState({goLive: "Completet"});
                })
              }
            })
          }
          createLiveBlock(array, index){
            console.log("create")
            ApiReq('/api/post/createLiveBlock', 'POST', {pageid: array[index].pageid, possml: array[index].possml, posmd: array[index].posmd, posbig: array[index].posbig, data: array[index].data, zelltype: array[index].zelltype,Style: array[index].style}, true).then(res => {console.log(res);
              if(array.length > index + 1){
                if(array[index + 1].data == "!!DELETE!!"){
                  this.deleteLiveBlock(array, index+1);
                }else if(array[index + 1].newblock){
                  this.createLiveBlock(array, index+1);
                }else if(!array[index + 1].newblock){
                  this.updateLiveBlock(array, index+1);
                }
              }else{
                ApiReq('/api/delete/deleteAllNotLiveItem', 'DELETE', {pageId: this.pageid}, true).then(res => {console.log(res);
                  this.setState({goLive: "Completet"});
                })
              }
            })
          }
          updateLiveBlock(array, index){
            console.log("update")
        
            ApiReq('/api/put/updateWholeLiveBlock', 'PUT', {possml: array[index].possml, posmd: array[index].posmd, posbig: array[index].posbig, data: array[index].data, Style: array[index].style}, true).then(res => {console.log(res);
              if(array.length > index + 1){
                if(array[index + 1].data == "!!DELETE!!"){
                  this.deleteLiveBlock(array, index+1);
                }else if(array[index + 1].newblock){
                  this.createLiveBlock(array, index+1);
                }else if(!array[index + 1].newblock){
                  this.updateLiveBlock(array, index+1);
                }
              }else{
                ApiReq('/api/delete/updateWholeLiveBlock', 'DELETE', {pageId: this.pageid}, true).then(res => {console.log(res);
                  this.setState({goLive: "Completet"});
                })
              }
            })
          }

          activeTogle(e){
            this.setState({active:true});
            window.addEventListener('mouseup', this.deactivate, false);
          }

          deactivate(e){
            console.log(e);
            let Target = e.target;
            let realTarget = e.target;
            console.log(Target.tagName) 
            while(Target.id != "Table" && Target.tagName != "HTML"){
              if(Target.parentElement.id != "Table"){
                Target = Target.parentElement;
              }else{
                realTarget = Target;
                Target = Target.parentElement;
              }
            } 
            if(realTarget){
              if (realTarget.id != this.state.input._id){
                window.removeEventListener('mouseup', this.deactivate, false);
                this.setState({active: false});
              }
            }else {
              window.removeEventListener('mouseup', this.deactivate, false);
              this.setState({active: false});
            };
          }
        
        
        
            render(){
                let sr = this.props.screensize;
                if(sr == 20){
                    this.state.Pos = this.state.input.possml;
                    this.nogoArea = this.props.NogoArea.sml;
                }else if(sr == 40){
                    this.state.Pos = this.state.input.posmd;
                    this.nogoArea = this.props.NogoArea.md;
                }else if(sr == 50){
                    this.state.Pos = this.state.input.posbig;
                    this.nogoArea = this.props.NogoArea.big;
                }else{console.log("Error: screensice not set.")};
        
                const pos = this.state.Pos;
                let Blockcontent;
                switch(this.props.content.zelltype) {   
            case "TEXTCELL": Blockcontent = <TEXTCELL Data={this.state.Content} />; break; 
            case "Test": Blockcontent = <Test Data={this.state.Content} />; break; 
            case "Header": Blockcontent = <Header Data={this.state.Content} />; break;
                    default:
                    console.log("This kind of block does not exist(this.props.content.zelltype)")
                }
                return (
                    <>
                        <div className="Blackbox" key={this.state.input._id} id={this.state.input._id} draggable={this.state.active ? "true" : "false"} onDragStart={(event) => this.onDragStart(event)} onDrag={(event) => this.onDrag(event)} onDragEnd={event => this.OnDragEnd(event)} onMouseUp={event => {this.state.active ? null : this.activeTogle(event)}}>
                             <style jsx>{`
                                .Blackbox { 
                                    grid-column-start: ${pos[0]};
                                    grid-column-end: ${pos[0] + pos[3] - 1};
                                    grid-row-start: ${pos[1]};
                                    grid-row-end: ${pos[1] + pos[2] - 1};
                                    position: relative;
                                    ${this.state.active ? 'border-radius: 0; border: 0.1rem solid blue;' : null}
                                    cursor: grab;
                                }
                                .activestyles:hover{
                                    border-color: blue;
                                }
                                .activestyles{
                                  width: 100%;
                                  height: 100%;
                                  ${this.state.styleTags}
                                }
                            `}</style>
                            <div className="activestyles">
                              {Blockcontent}
                              <div className={styles.resizer} onMouseDown={(event) => this.resize(event)}></div>
                              {this.state.active ?  
                                <div className={styles.edit_button} onClick={event => {this.EdditBlock(event)}}><a>edit</a></div>
                              : <> </>}
                              {this.state.active ?  
                                <div className={styles.Live_Toggle} onClick={event => {this.GoLive()}}><a>{this.state.goLive}</a></div>
                              : <> </>}
                            </div>
                        </div>
                        {this.state.editWindow}
                    </>
                )
                
            }
        }
        
        export default Blackbox
        