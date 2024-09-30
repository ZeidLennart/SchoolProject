import React, { Component } from 'react';
import ApiReq from '../../db/ApiReq.js';
import NavBar from '../../components/admin/navBar/navBar.js';


export default class EditNavBar extends Component {
  constructor(props) {
    super(props) ;
       this.state = {
          res : [ ],
          isLoaded : false,
       }
 }  
  componentDidMount() { // Beide Eingaben müssen wie folgt sein: '2,4,5' und dann im Zwieten Array '34,37,12' Also Arrays zu Strings Geschrieben
    ApiReq('/api/get/allNavs', 'GET', {}).then(res => {this.setState ({isLoaded: true,  res: rewrite(res.content.rows, true, 0),});});
  }  
componentDidUpdate(){
  console.log("Update")
}

  render() {
    var{isLoaded,res}= this.state;
    if(!isLoaded) {
      return <>NavBar Data is Loading</>
    }
    else {
      return (
        <div ><NavBar Data={res}/></div>
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
}