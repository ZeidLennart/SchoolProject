import React, { Component } from 'react'; 
import Boxlayout from "../../components/Admin/Blocks/Boxlayout";
import AddWindow from "../../components/Admin/Blocks/addWindow";
import {withRouter} from "next/router";
import ApiReq from '../../db/ApiReq';
import NogoArea from '../../../NogoArea';
import styles from '../../styles/Admin/actionBar.module.css'


class AdminPageEdit extends Component {

  constructor(props) {
    super(props);
    this.Style = {};
    this.currentscreen = null;
    this.returnedBlocks = [];
    this.pageId;
    this.state = {
        Contentres: [],
        NotLiveData: [],
        DataisLoaded: false,
        liveEddit: false,
        addwindow: false,
        goLive: "Go Live",
    }
  }  

  resized(w) {
    const smalscreen = {maxwidth: 760, minwidth: 0}
    const mediumsreen = {maxwidth: 1100, minwidth: 761}
    let newcol;   
    if(w <= smalscreen.maxwidth && w >= smalscreen.minwidth){
        newcol = 20;
        this.currentscreen = "smal";
    } else if(w <= mediumsreen.maxwidth && w >= mediumsreen.minwidth){
        newcol = 40;
        this.currentscreen = "medium";
      } else{
        newcol = 50;
        this.currentscreen = "big";
    }
    return newcol;
  }

  gettingData(rout){
    const state = {
        Contentres: [],
        DataisLoaded: false,
    }
    const NotLive = {
      Contentres: [],
      DataisLoaded: false,
    }
    let pageId;
    ApiReq('/api/get/allNavs', 'GET', {}).then(res => {pageId=getPageId(res.content.rows, this.props.router.query.pid)}).then(() => {
      this.pageId = pageId
        ApiReq('/api/post/Currentcontent', 'POST', {Pageid: pageId}).then(respo => {state.Contentres = respo; state.DataisLoaded = true}).then(() => {
            this.Style.curcol = this.resized(window.innerWidth);
            if(this.state.liveEddit){
              this.setState(state);
            }else{
              ApiReq('/api/post/NotLiveData', 'POST', {Pageid: pageId}, true).then(respo => {NotLive.Contentres = respo; NotLive.DataisLoaded = true}).then(() => {
                this.setState(this.LiveServerDatacompromise(state, NotLive))
              })
            }
        }) 
    });
  }

  LiveServerDatacompromise(state, NotLive){
    if(state.Contentres.status == "success" && NotLive.Contentres.status == "success"){
      let liveBlocks = state.Contentres.content.rows;
      let notLiveBlocks = NotLive.Contentres.content.rows;
      const newstate = state;
      notLiveBlocks.forEach(elem => {
          if(elem.newblock){
            liveBlocks.push(elem)
          }else if(!elem.newblock){
            for(let i = 0; i <= liveBlocks.length - 1; i++){
              if(liveBlocks[i]._id == elem._id){
                if(elem.data != "!!DELETET!!"){
                  const newelem = elem;
                  newelem.zelltype = liveBlocks[i].zelltype;
                  liveBlocks[i] = newelem;
                }else{
                  let newarray = liveBlocks.slice(0,i);
                  for(let j = i + 1; j <= liveBlocks.length - 1; j++){
                    newarray.push(liveBlocks[j])
                  }
                  liveBlocks = newarray;
                }
              }
            }
          }
      })
      newstate.Contentres.content.rows = liveBlocks;
      return newstate;
    }else{
      return state;
    }
  }

  componentDidMount(){
    this.Style.curcol = this.Style.newcol;
    window.addEventListener('resize', (event) => {
      this.Style.newcol = this.resized(window.innerWidth);
      if(this.Style.newcol !== this.Style.curcol){
        this.Style.curcol = this.Style.newcol;
        if(this.state.Contentres.status == "success"){this.setState({status: true});}else{console.log(Data)}; 
      }
    });
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  addBlock(){
    this.setState({addwindow: <AddWindow pageId={this.pageId} active={true} liveEddit={this.state.liveEddit}></AddWindow>})
  }

  GoLive(){
    console.log(this.pageid)

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
        ApiReq('/api/delete/deleteAllNotLiveItem', 'DELETE', {pageId: this.pageId}, true).then(res => {console.log(res);
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
        ApiReq('/api/delete/deleteAllNotLiveItem', 'DELETE', {pageId: this.pageId}, true).then(res => {console.log(res);
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
        ApiReq('/api/delete/deleteAllNotLiveItem', 'DELETE', {pageId: this.pageId}, true).then(res => {console.log(res);
          this.setState({goLive: "Completet"});
        })
      }
    })
  }

  render() {
    let Content;
    let curRout = "";
    let ToggleData;
    if(this.state.liveEddit){ToggleData = "active"}else{ToggleData = "not active"}

    if(!this.props.router.query.pid){curRout = "/Admin/[...pid]"}else{
      this.props.router.query.pid.map(elem => {curRout = curRout + "/" + elem});
    }
    if(curRout != "/Admin/[...pid]" && curRout != this.rout){
        this.rout = curRout;
        this.gettingData(curRout);
    }
    if(this.state.DataisLoaded){
      if(this.state.Contentres.status) {Content = this.state.Contentres.content.rows;}else{Content = []}; 
      let pageres = "";
      if(Content.length == 0){
        pageres =<div>This Page has no Content</div>
      }
      return (
        <div className="container" id="Table"  onDragOver={(event => this.onDragOver(event))}>  
          <style jsx>{`
            .container { 
              width: 100vw;
              display: grid; 
              overflow-y: scroll;
              grid-column: ${this.Style.curcol};
              grid-template-columns: repeat(${this.Style.curcol}, 1fr);
              grid-auto-rows: ${100 / this.Style.curcol}vw;
            }
        `}</style>
        <div className={styles.container}>
        {pageres} 
          <div className={styles.screensize}>
            <div>
                <h3>screensize</h3>
            </div>
            <div className={(this.Style.curcol == 20) ? styles.activeScreepos : styles.screepos} onClick={event => {this.Style.curcol = 20; this.forceUpdate()}}>
                <a>smal</a>
            </div>
            <div className={(this.Style.curcol == 40) ? styles.activeScreepos : styles.screepos} onClick={event => {this.Style.curcol = 40; this.forceUpdate()}}>
                <a>medium</a>
            </div>
            <div className={(this.Style.curcol == 50) ? styles.activeScreepos : styles.screepos} onClick={event => {this.Style.curcol = 50; this.forceUpdate()}}>
                <a>big</a>
            </div>
          </div>
          <div className={styles.buttonAction}>
            <div className={styles.Live_Toggle} onClick={event => {this.setState({Contentres: [], NotLiveData: [], liveEddit: !this.state.liveEddit}); this.gettingData(curRout)}}>
              <a>Live eddeting: <br />{ToggleData}</a>
            </div>
            <div className={styles.Live_Toggle} onClick={event => {this.addBlock()}}>
              <a>addBlock</a>
            </div>
            <div className={styles.Live_Toggle} onClick={event => {this.GoLive()}}>
              <a>{this.state.goLive}</a>
            </div>
          </div>
        </div>
        {this.state.addwindow}
          {Content.map(elem => {
              return <Boxlayout content={elem} NogoArea={NogoArea} liveEddit={this.state.liveEddit} screensize={this.Style.curcol} id={elem._id} key={elem._id}></Boxlayout> 
          })}    
        </div>
      );
      
    }else{
      return(
          <div>Data is Loading or an Error occurred</div>
      )
  }
  }
}
function getPageId(data, rout, index = 0) {
  let PageId;
  data.forEach(elem => {
      if(elem.url == rout[index]){
          PageId = elem._id;
          if(elem.children){
              if(elem.children.length >= 1 && index + 1 < rout.length){
                  PageId = getPageId(elem.children, rout, index + 1)
              }
          }
      }
  })
  return PageId;
}

export default withRouter(AdminPageEdit);