import React from 'react';
import { Media, Button } from 'react-bootstrap';
import List from "./List";
import Write from "./Write";
import tp, {store} from "../tp.js";

console.log("App.js call");

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = tp.loadState();
        
        let that = this;
        
        const unsubscribe = store.subscribe(()=>{
            that.setState(store.getState());
        });
    }

    render(){
        console.log("App rendering");
        return (
            <div>{
                this.state.mode === "list"
                ?
                <List app={this}/>
                :
                <Write app={this}/>
            }</div>
        );
    }
}