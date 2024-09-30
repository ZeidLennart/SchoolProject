import React, {Component} from 'React';
import NavBar from "../components/Public/NavBar/Navbar.js";
import {withRouter} from "next/router";
import ApiReq from '../db/ApiReq.js';
import Boxlayout from "../components/Public/Content/Boxlayout"; 
import NogoArea from '../../NogoArea';


class Content extends Component {
  constructor(props) {
    super(props);
    this.Style = {};
    this.rout;
    this.currentscreen = null;
    this.returnedBlocks = [];
    this.state = {
        res : [],
        NavisLoaded : false,
        Contentres: [],
        DataisLoaded: false,
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
    const status = {
        res : [],
        NavisLoaded : false,
        Contentres: [],
        DataisLoaded: false,
    }
    let pageId;
    ApiReq('/api/get/allNavs', 'GET', {}).then(res => {status.NavisLoaded= true;  status.res = rewrite(res.content.rows, true, 0); pageId=getPageId(res.content.rows, this.props.router.query.pid)}).then(() => {
        ApiReq('/api/post/Currentcontent', 'POST', {Pageid: pageId}).then(respo => {status.Contentres = respo; status.DataisLoaded = true; console.log(respo)}).then(() => {
            this.Style.curcol = this.resized(window.innerWidth);
            this.setState(status);
        }) 
    });
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

  render() {
    let Contenet;
    const curRout = this.props.router.asPath;
    if(curRout != "/[...pid]" && curRout != this.rout){
        this.rout = curRout;
        this.gettingData(this.props.router.asPath);
    }
    if(this.state.DataisLoaded && this.state.NavisLoaded && this.state.Contentres != undefined && this.state.res != undefined){
        if(this.state.Contentres.status) {Contenet = this.state.Contentres.content.rows;}else{Contenet = []}; 
        if(Contenet.length == 0){
            return(
              <div>This Page has no Content</div>
            )
        }else{
            return (
            <div className="container" id="Table">  
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
                <NavBar content={ this.state.res } RoutChange = {true}></NavBar>
                {Contenet.map(elem => {
                    return <Boxlayout content={elem} NogoArea={NogoArea} screensize={this.Style.curcol} id={elem._id} key={elem._id}>{elem._id}</Boxlayout> 
                })} 
            
            </div>
            );
        }
    }else{
        return(
            <div>Data is Loading or an Error occurred</div>
        )
    }
  }
}
        
  function rewrite(Navcontent, first, parentid){
    let result = [];
    Navcontent.forEach(elem => {
        let children = [];
        if(elem.parentid == 0 && first){
            for(let i = Navcontent.length - 1; i >= 0 ; i--){ 
                if(Navcontent[i].parentid == elem._id){
                    children.push(rewrite(Navcontent, false, elem._id))
                    Navcontent.splice(i,1); 
                }
            }
            elem.children = children;
            result = Navcontent;
        }else if(!first && parentid == elem.parentid){
            let res = elem;
            for(let i = Navcontent.length - 1; i >= 0 ; i--){ 
                if(Navcontent[i].parentid == elem._id){ 
                    children.push(rewrite(Navcontent, false, elem._id))
                    res.children = children;
                    Navcontent.splice(i,1); 
                }
            }  
            result = res;
        }
    });
    return result;
};

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

export default withRouter(Content);