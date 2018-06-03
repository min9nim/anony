import React from 'react';
import { Media, Button } from 'react-bootstrap';
import List from "./List";
import Write from "./Write";
import {tp} from "../tp.js";

console.log("App.js call");

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = tp.state;

        let that = this;

        const unsubscribe = tp.store.subscribe(()=>{
            that.setState(tp.store.getState());
        });
    }

    render(){
        console.log("App rendering");
        return (
            <div>{
                this.state.mode === "list" ?
                <List app={this}/> :
                <Write app={this}/>
            }</div>
        );
    }
}
