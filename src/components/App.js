import React from 'react';
import { Media, Button } from 'react-bootstrap';
import List from "./List";
import Write from "./Write";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          mode: 'list',
          posts: JSON.parse(localStorage.getItem("posts")),
        };
        window.app = this;
    }

    render(){
        console.log("App rendering");
        return (
            <div>{
                this.state.mode === "list"
                ?
                <List parentObj={this}/>
                :
                <Write parentObj={this}/>
            }</div>
        );
    }
}
