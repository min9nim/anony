import React from "react";
import shortcut from "../ext/shortcut";
import { SearchBox } from "../components";
import "./Search.scss";

export default class Search extends React.Component {
    constructor(props) {
        //console.log("Search 생성자 호출");
        super(props);
        this.showSearch = this.showSearch.bind(this);
        this.hideSearch = this.hideSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.search = this.search.bind(this);
        this.onTyping = 0;


        this.state = {
            clicked: false,
            word: ""
        }

        /**
         * 2018.10.09
         * min9nim
         * 검색 단축키는 굳이 필요 없을 것 같아서 주석처리
         */
        //shortcut.add("Alt+S", this.showSearch);

        // 이후 Search 가 스토어 상태를 구독하도록 설정
        this.unsubscribe = tp.store.subscribe(() => {
            // console.log("Search가 store 상태 변경 노티 받음")
            this.setState({ word: tp.store.getState().view.search });
        });
    }


    hideSearch() {
        this.setState({ clicked: false, word: "" });
    }

    showSearch() {
        this.setState({ clicked: true });
    }

    handleChange(e) {
        let word = e.target.value;
        //console.log(e.target.value);
        if (this.onTyping) {
            //console.log("타이머 초기화")
            clearTimeout(this.onTyping);
        }
        this.onTyping = setTimeout(() => {
            //console.log("검색어 = " + word)
            this.search()
            this.onTyping = 0;
        }, 1000)
        this.setState({ word: e.target.value });
    }

    handleKeyPress(e) {
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            this.search();
        }
    }

    componentWillUnmount() {
        //console.log("Search componentWillUnmount..");
        this.unsubscribe();
    }


    search() {
        const search = this.state.word.trim();
        if (search === "") {
            // tp.alert({
            //     message: "Keyword is empty", 
            //     style: "warning",
            //     width: "180px"
            // });
            //return;
        }

        // 기존내용 초기화
        tp.store.dispatch(tp.action.initPosts());
        tp.isScrollLast = false;

        // 다시 세팅
        tp.api.getPosts({ idx: 0, cnt: 10, search, context: this.props.context })
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.addPosts(res.posts)));

        // 현재 검색어 세팅
        tp.store.dispatch(tp.action.setSearch(search));

        //this.hideSearch();
    }

    render() {
        //console.log("Search 렌더링");
        return (
            <div className="Search">
                {
                    tp.isDesktop()
                        ?
                        <React.Fragment>
                            <div className="icon-search btn1" onClick={this.search}></div>
                            <div className="ipt-wrapper">
                                <input className="ipt-search"
                                    value={this.state.word}
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="icon-search btn2" onClick={this.showSearch}></div>
                            {this.state.clicked &&
                                <SearchBox hideSearch={this.hideSearch} context={this.props.context} title="Search button" />}
                        </React.Fragment>
                }
            </div>
        );
    }
}
