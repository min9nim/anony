import React from 'react';
import shortcut from "../ext/shortcut";
import {SearchBox} from "../components";
import "./Search.scss";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.showSearch = this.showSearch.bind(this);
        this.hideSearch = this.hideSearch.bind(this);
        
        this.state = {
            clicked : false
        }
        shortcut.add("Alt+S", this.showSearch);        
    }


    hideSearch(){
        this.setState({clicked: false, word: ""});
    }

    showSearch(){
        this.setState({clicked: true});
    }

    render(){
        console.log("Search 렌더링");
        return (
            <div className="Search">
                <div className="nav" onClick={this.showSearch}><img src="/img/search-btn.png"/></div>
                
                {this.state.clicked &&        
                    <SearchBox hideSearch={this.hideSearch} context={this.props.context}/>        
                }
            </div>
        );
    }
}
