
import React, { Component } from 'React';  
import TEXTCELL from '../../admin/blocks/contentToLoad/TEXTCELL.js'; 
import Test from '../../admin/blocks/contentToLoad/Test.js'; 
import Header from '../../admin/blocks/contentToLoad/Header.js'; 

class Blackbox extends Component{
    constructor(props){
        super(props)
        this.state = {
            Pos:[],
            style: "",
            styleTags: "",
            Content: "",
        };
        this.nogoArea = [];
    }

    componentDidMount(){
        console.log(this.props.content)
        if(this.props.content.style != "" && this.props.content.style != null){
            const styleobjekt = JSON.parse(this.props.content.style)
            const styleTags = `border-radius: ${styleobjekt.borderRadius}%; border: 0.${styleobjekt.borderwidth}rem solid black;`
            this.setState({style: styleobjekt, styleTags: styleTags}) 
        }
    }

    render(){
        let sr = this.props.screensize;
        if(sr == 20){
            this.state.Pos = this.props.content.possml;
            this.nogoArea = this.props.NogoArea.sml;
        }else if(sr == 40){
            this.state.Pos = this.props.content.posmd;
            this.nogoArea = this.props.NogoArea.md;
        }else if(sr == 50){
            this.state.Pos = this.props.content.posbig;
            this.nogoArea = this.props.NogoArea.big;
        }else{console.log("Error: screensice not set.")};

        let Blockcontent;
        switch(this.props.content.zelltype) {   
            case "TEXTCELL": Blockcontent = <TEXTCELL Data={this.props.content.data} />; break; 
            case "Test": Blockcontent = <Test Data={this.props.content.data} />; break; 
            case "Header": Blockcontent = <Header Data={this.props.content.data} />; break; 
            default:
            console.log("This kind of block does not exist(this.props.content.zelltype)")
        }

        const pos = this.state.Pos;
        return (
            <div className="Blackbox" key={this.props.content._id}>
                <style jsx>{`
                    .Blackbox { 
                        grid-column-start: ${pos[0]};
                        grid-column-end: ${pos[0] + pos[3] - 1};
                        grid-row-start: ${pos[1]};
                        grid-row-end: ${pos[1] + pos[2] - 1};
                        position: relative;
                        ${this.state.styleTags}
                    }
                `}</style>
            
            {Blockcontent}
            </div>
        )
    }
}

export default Blackbox
        