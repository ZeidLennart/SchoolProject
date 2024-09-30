import React, { Component } from 'react'

            export default class header extends Component {
                constructor(props){
                    super(props)
                    this.Data = "";
                }
                render() {
                    if(this.props.Data != ""){this.Data = JSON.parse(this.props.Data)}
                    return (
                        <div className="BlContent">
                                <style jsx>{`
                                .BlContent { 
                                    height: 100%;
                                    width:100%;
                                };
                                .tagClass { 
                                    margin:0; 
                                    margin-top: 10px;
                                    margin-top: 5px; text-align:center                
                                }
                                `}</style>
                                <h4 className="tagClass"> {this.Data.Moke} <h2> {this.Data.Sven} </h2> </h4>
                        </div>
                    )
                }
            }