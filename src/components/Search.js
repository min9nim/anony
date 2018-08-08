import React from 'react';
import {tp} from "../tp";
import shortcut from "../ext/shortcut";
import "./Search.scss";
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Button
  } from 'react-bootstrap';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.showSearch = this.showSearch.bind(this);
        this.hideSearch = this.hideSearch.bind(this);
        this.search = this.search.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.state = {
            word: "",
            uuid: tp.user.uuid,
            clicked : false
        }
        shortcut.add("Alt+S", this.showSearch);        
    }


    search(){
        const search = this.state.word.trim();
        if(search === ""){
            alert("input keyword");
            return;
        }

        // 기존내용 초기화
        tp.store.dispatch(tp.action.initPosts());
        tp.isScrollLast = false;

        // 다시 세팅
        tp.api.getPosts({idx: 0, cnt: 10, search, context: this.props.context})
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.addPosts(res.posts)));
        
        // 현재 검색어 세팅
        tp.store.dispatch(tp.action.setSearch(search));

        this.hideSearch();
    }

    hideSearch(){
        this.setState({clicked: false, word: ""});
    }

    handleChange(e) {
        this.setState({word: e.target.value});
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
                    <div className="searchBox">
                        <div className="modal_div"></div>
                        <div className="search_div">
                            <FormGroup controlId = "word">
                                {/*<ControlLabel> Content </ControlLabel>*/}
                                <FormControl className="input"
                                        autoFocus
                                        value = {this.state.word}
                                        onChange = {this.handleChange}
                                        componentClass = "textarea"
                                        placeholder = "word.." />
                            </FormGroup>

                            <div className="btn_grp">
                                <Button className="searchBtn" bsStyle="success" onClick={this.search}>Search</Button>
                                <Button className="cancelBtn" bsStyle="success" onClick={this.hideSearch}>Cancel</Button>
                            </div>    
                        </div>                
                    </div>
                }
            </div>
        );
    }
}
