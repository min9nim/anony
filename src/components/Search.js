import React from "react";
import shortcut from "../ext/shortcut";
import { SearchBox } from "../components";
import "./Search.scss";

export default class Search extends React.Component {
    constructor(props) {
        console.log("Search 생성자 호출");
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
            /**
             * 11.11.08
             * 검색어 입력시 실시간 결과조회 기능 구현하니까
             * 검색어 입력시 문제가 있어서 아래 주석처리함
             */
            if (this.state.word !== tp.store.getState().view.search) {
                console.log("this.state.word = " + this.state.word);
                console.log("state_word = " + tp.store.getState().view.search);
                this.setState({ word: tp.store.getState().view.search });
            }
            // debugger;
            // console.log("Search forceUpdate 호출 전")
            // this.forceUpdate();
            // console.log("Search forceUpdate 호출 후")
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.word !== nextState.word) {
            console.log("word가 다르니까 렌더링")
            return true;
        }if (this.state.clicked !== nextState.clicked) {
            console.log("clicked 다르니까 렌더링")
            return true;
        } else {
            console.log("word 가 같음 Search 렌더링 안함")
            return false;
        }
    }


    hideSearch() {
        this.setState({ clicked: false, word: "" });
    }

    showSearch() {
        this.setState({ clicked: true });
    }

    handleChange(e) {
        if(tp.view.ListLoader.state.loading) return;

        let word = e.target.value;
        //console.log(e.target.value);

        // tp.store.dispatch(tp.action.setSearch(word));
        // if (this.onTyping) {
        //     console.log("타이머 초기화")
        //     clearTimeout(this.onTyping);
        // }
        // this.onTyping = setTimeout(() => {
        //     console.log("검색어 = " + word)
        //     this.search(word)
        //     this.onTyping = 0;
        // }, 500)



        this.setState({ word: e.target.value }, () => {
            if (this.onTyping) {
                // console.log("타이머 초기화")
                clearTimeout(this.onTyping);
            }
            this.onTyping = setTimeout(() => {
                // console.log("검색어 = " + word)
                this.search(word)
                this.onTyping = 0;
            }, 300)
        });
    }

    handleKeyPress(e) {
        return; // 18.11.10 이 함수는 이제 사용안함(handleChange 에서 다 처리됨)
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            this.search(e.target.value);
        }
    }

    componentWillUnmount() {
        //console.log("Search componentWillUnmount..");
        this.unsubscribe();
    }

    componentDidMount() {
        console.log("Search componentDidMount")
    }


    search(word) {
        const search = word.trim();
        //const search = this.state.word.trim();
        if (search === "") {
            // tp.alert({
            //     message: "Keyword is empty", 
            //     style: "warning",
            //     width: "180px"
            // });
            //return;
        }


        // 18.11.10 스토어의 검색어 상태 미리 변경해둠
        tp.store.dispatch(tp.action.setSearch(search));


        // 기존내용 초기화
        tp.store.dispatch(tp.action.initPosts());
        //tp.view.ListLoader.setState({ loading: true });
        tp.isScrollLast = false;

        // 다시 세팅
        tp.api.getPosts({ idx: 0, cnt: 10, search, context: this.props.context })
            .then(tp.checkStatus)
            .then(res => {
                tp.store.dispatch(tp.action.addPosts(res.posts))
                //tp.view.ListLoader.setState({ loading: false });
            });

        // 현재 검색어 세팅


        //this.hideSearch();
    }

    render() {
        console.log("Search 렌더링");

        return (
            <div className="Search">
                {
                    tp.isDesktop()
                        ?
                        <React.Fragment>
                            <div className="icon-search btn1" onClick={this.search}></div>
                            <div className="ipt-wrapper">
                                <input className="ipt-search"
                                    //value={tp.store.getState().view.search}
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
