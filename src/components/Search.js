import React from 'react'
import { SearchBox } from '../components'
import { debounce } from 'interval-call'
import './Search.scss'

export class Search extends React.Component {
  constructor(props) {
    // ctx.logger.verbose("Search 생성자 호출");
    super(props)
    this.showSearch = this.showSearch.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.search = debounce(this.search.bind(this), 500)
    this.onTyping = 0

    this.state = {
      clicked: false,
      word: '',
    }

    // 이후 Search 가 스토어 상태를 구독하도록 설정
    this.unsubscribe = ctx.store.subscribe(() => {
      // ctx.logger.verbose("Search가 store 상태 변경 노티 받음")
      if (this.state.word !== ctx.store.getState().view.search) {
        //ctx.logger.verbose("this.state.word = " + this.state.word);
        //ctx.logger.verbose("state_word = " + ctx.store.getState().view.search);
        this.setState({ word: ctx.store.getState().view.search })
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.word !== nextState.word) {
      // ctx.logger.verbose("word가 다르니까 렌더링")
      return true
    }
    if (this.state.clicked !== nextState.clicked) {
      // ctx.logger.verbose("clicked 다르니까 렌더링")
      return true
    } else {
      // ctx.logger.verbose("word 가 같음 Search 렌더링 안함")
      return false
    }
  }

  hideSearch() {
    this.setState({ clicked: false, word: '' })
  }

  showSearch() {
    this.setState({ clicked: true })
  }

  handleChange(e) {
    let word = e.target.value
    this.setState({ word }, () => this.search(word))
  }

  componentWillUnmount() {
    //ctx.logger.verbose("Search componentWillUnmount..");
    this.unsubscribe()
  }

  componentDidMount() {
    ctx.logger.verbose('Search componentDidMount')
  }

  search(word) {
    if (ctx.view.ListLoader.state.loading) {
      this.fetchController.abort()
    }
    this.fetchController = new AbortController()
    const signal = this.fetchController.signal

    const search = word.trim()

    // 18.11.10 스토어의 검색어 상태 미리 변경해둠
    ctx.store.dispatch(ctx.action.setSearch(search))

    // 기존내용 초기화
    ctx.store.dispatch(ctx.action.initPosts())
    //ctx.view.ListLoader.setState({ loading: true });
    ctx.view.ListLoader.state.loading = true
    this.ipt.style.backgroundColor = '#eee'

    ctx.isScrollLast = false

    // 다시 세팅
    ctx.api
      .getPosts({
        idx: 0,
        cnt: 10,
        search,
        context: this.props.context,
        signal,
      })
      .then((res) => {
        ctx.view.ListLoader.setState({ loading: false })
        this.ipt.style.backgroundColor = ''
        //ctx.view.ListLoader.state.loading = false;
        ctx.store.dispatch(ctx.action.addPosts(res.posts))
      })
      .catch((e) => ctx.logger.error(e))
  }

  render() {
    // ctx.logger.verbose("Search 렌더링");

    return (
      <div className="search">
        {ctx.isDesktop() ? (
          <React.Fragment>
            <div className="icon-search btn1" onClick={this.search}></div>
            <div className="ipt-wrapper">
              <input
                className="ipt-search"
                //value={ctx.store.getState().view.search}
                ref={(ele) => {
                  this.ipt = ele
                }}
                value={this.state.word}
                onChange={this.handleChange}
              />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="icon-search btn2" onClick={this.showSearch}></div>
            {this.state.clicked && (
              <SearchBox
                hideSearch={this.hideSearch}
                context={this.props.context}
                title="Search button"
              />
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}
