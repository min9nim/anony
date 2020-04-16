import React from 'react'
import { ctx } from '@/biz/context'
import './SearchBox.scss'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'

export class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.hideSearch = this.props.hideSearch
    this.search = this.search.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      word: '',
      uuid: ctx.user.uuid,
    }
  }

  search() {
    const search = this.state.word.trim()
    if (search === '') {
      ctx.alert({
        message: 'Keyword is empty',
        style: 'warning',
        width: '180px',
      })
      return
    }

    // 기존내용 초기화
    ctx.store.dispatch(ctx.action.initPosts())
    ctx.noMore = false

    // 다시 세팅
    ctx.api
      .getPosts({ idx: 0, cnt: 10, search, context: this.props.context })
      .then((res) => ctx.store.dispatch(ctx.action.addPosts(res.posts)))

    // 현재 검색어 세팅
    ctx.store.dispatch(ctx.action.setSearch(search))

    this.hideSearch()
  }

  handleChange(e) {
    this.setState({ word: e.target.value })
  }

  render() {
    //ctx.logger.verbose("Search 렌더링");
    return (
      <div className="searchBox">
        <div className="modal_div"></div>
        <div className="search_div">
          <FormGroup controlId="word">
            {/*<ControlLabel> Content </ControlLabel>*/}
            <FormControl
              className="input"
              autoFocus
              value={this.state.word}
              onChange={this.handleChange}
              componentClass="textarea"
              placeholder="word.."
            />
          </FormGroup>

          <div className="btn_grp">
            <Button
              className="searchBtn"
              bsStyle="success"
              onClick={this.search}
            >
              Search
            </Button>
            <Button
              className="cancelBtn"
              bsStyle="success"
              onClick={this.hideSearch}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
