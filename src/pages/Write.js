import React from 'react'
import shortid from 'shortid'
import { ctx } from '@/biz/context'
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import './Write.scss'

export default class Write extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.savePost = this.savePost.bind(this)
    this.cancel = this.cancel.bind(this)
    this.refreshUuid = this.refreshUuid.bind(this)
    this.deleteUuid = this.deleteUuid.bind(this)
    this.deleteContext = this.deleteContext.bind(this)
    this.deleteTitle = this.deleteTitle.bind(this)
    this.deleteWriter = this.deleteWriter.bind(this)
    this.toggleAdvancedOpt = this.toggleAdvancedOpt.bind(this)

    this.state = {
      key: '',
      title: '',
      writer: ctx.user.writer,
      content: '',
      date: '',
      isPrivate: false,
      isMarkdown:
        ctx.user.isMarkdown === undefined ? false : ctx.user.isMarkdown,
      hasComment:
        ctx.user.hasComment === undefined ? true : ctx.user.hasComment,
      uuid: ctx.user.uuid,
      context: this.props.context ? this.props.context : 'public',
      optClicked: false,
      autoTitle: this.props.type === 'edit' ? false : true,
    }

    if (this.props.type === 'edit') {
      this.initializeInEdit()
    }
  }

  initializeInEdit() {
    if (ctx.store.getState().data.posts.length > 0) {
      // 글보기화면이나 목록화면에서 넘어 들어온 경우
      //this.state = this.props.post;
      this.state = ctx.store
        .getState()
        .data.posts.find((post) => post.key === this.props.postKey)
      this.state.uuid = ctx.user.uuid
      /**
       * 18.09.13
       * min9nim
       * 정상적인 접근 방법으로는 아래 분기로직으로 진입이 불가능하기에 아래 주석처리함
       */
      // if(this.state.origin !== undefined){

      //   ctx.alert({
      //     message: "Invalid access!",
      //     style: "danger",
      //     onClose: history.back
      //   });
      // }
    } else {
      // URL로 직접 들어온 경우

      /**
       * 18.11.03
       * 글수정 화면의 직접 access 를 허용할 경우
       * 해당 글의 context 정보가 노출되는 문제가 있다
       */
      alert('Invalid access')
      history.back()
      return

      ctx.api.getPost(this.props.postKey).then((res) => {
        //this.state = res.post;

        /**
         * 18.09.13
         * min9nim
         * 어짜피 아래 스토어 갱신에 따라 setState가 호출될 것이기 때문에 위 문장 필요없음
         */
        this.state.uuid = ctx.user.uuid // uuid 는 res.post 에 포함되어 있지 않다
        ctx.store.dispatch(ctx.action.addPost(res.post))
      })
    }

    this.unsubscribe = ctx.store.subscribe(() => {
      //ctx.logger.verbose("Edit가 store 상태변경 노티 받음");
      if (this.state.key === '') {
        // URL로 직접 들어온 경우에만 this.setState가 필요
        this.setState(
          ctx.store
            .getState()
            .data.posts.find((post) => post.key === this.props.postKey),
        )
      } else {
        /**
         * 18.09.13
         * min9nim
         * 여기서 this.setState 를 하게 되면,
         * 글 수정후 저장시 ctx.setUser() 에 의해 store가 갱신되고
         * 이때 잠시 수정 전 글이 잠깐 원복되어져 보이게 되는 문제가 발생할 수 있어서 분기처리함
         */
      }
    })
  }

  componentWillUnmount() {
    if (this.props.type === 'edit') {
      //ctx.logger.verbose("# Edit unsubscribe store..");
      this.unsubscribe && this.unsubscribe()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.type === 'edit' && nextState.origin !== undefined) {
      // 히스토리 글을 수정하려고 하는 경우
      alert('Invalid access!')
      //history.back();
      /**
       * 18.09.13 min9nim
       * history.back() 를 사용하면 alert 가 연속으로 두세번 호출되는 문제가 있어서 그냥 아래와 같이 페이지 이동 처리
       */
      nextProps.history.push('/public/list')
      return false

      // ctx.alert({
      //   message: "Invalid access!",
      //   style: "danger",
      //   onClose: history.back
      // });
    }

    return nextState !== this.state
  }

  getValidationState() {
    let uuid = ctx.$m.removeTag(this.state.uuid).trim()
    const length = uuid.length
    if (shortid.isValid(this.state.uuid) && length >= 9) return 'success'
    else if (length > 5) return 'warning'
    else if (length > 0) return 'error'
    return null
  }

  componentDidMount() {
    document.title = this.props.context + ' - ' + ctx.thispage
  }

  toggleAdvancedOpt() {
    this.setState({ optClicked: !this.state.optClicked })
  }

  cancel() {
    if (this.props.type === 'edit') {
      // 글수정시 취소 버튼 클릭하면 글보기 화면으로 이동
      var arr = location.pathname.split('/')
      arr.splice(arr.indexOf('edit'), 1, 'post')
      this.props.history.push(arr.join('/'))
    } else {
      // in Write
      if (this.state.content.length > 10) {
        ctx.confirm({
          message: 'Cancel to write?',
          style: 'danger',
          width: '170px',
          onYes: () => {
            if (location.pathname === '/') {
              // 주소창에 서비스주소 입력해서 직접 들어온 경우
              this.props.history.push('/public/list')
            } else {
              history.back()
            }
          },
        })
      } else {
        if (location.pathname === '/') {
          // 주소창에 서비스주소 입력해서 직접 들어온 경우
          this.props.history.push('/public/list')
        } else {
          history.back()
        }
      }
    }
  }

  handleChange(e) {
    if (e.target.id === 'uuid' && e.target.value.length > ctx.MAXUUIDLEN) return
    if (e.target.id === 'context' && e.target.value.length > ctx.MAXCONTEXTLEN)
      return
    if (e.target.id === 'title') {
      this.state.autoTitle = false
    }

    if (
      (this.state.autoTitle || this.state.title === '') &&
      e.target.id === 'content'
    ) {
      if (e.target.value.length <= ctx.MAXTITLELEN) {
        this.state.title = e.target.value
      } else {
        this.state.title = e.target.value.substr(0, ctx.MAXTITLELEN)
        this.state.autoTitle = false
      }
    }

    this.setState({
      [e.target.id]:
        e.target.getAttribute('type') === 'checkbox'
          ? e.target.checked
          : e.target.value,
    })
  }

  refreshUuid() {
    if (this.props.type === 'edit') {
      // not allowed
    } else {
      this.setState({ uuid: shortid.generate() })
    }
  }

  deleteUuid() {
    if (this.props.type === 'edit') {
      // not allowed
    } else {
      this.setState({ uuid: '' })
      this.uuidinput.focus()
    }
  }
  deleteContext() {
    this.setState({ context: '' })
    this.contextinput.focus()
  }
  deleteTitle() {
    this.setState({ title: '' })
    this.titleinput.focus()
  }
  deleteWriter() {
    this.setState({ writer: '' })
    this.writerinput.focus()
  }
  savePost() {
    if (ctx.$m.removeTag(this.state.content).trim() === '') {
      ctx.alert({
        message: 'Content is empty',
        style: 'warning',
        width: '173px',
        onClose: () => {
          this.contentinput.focus()
        },
      })
      return
    }

    if (ctx.$m.removeTag(this.state.context).trim() === '') {
      ctx.alert({
        message: 'Channel is empty',
        style: 'warning',
        width: '176px',
        onClose: () => {
          this.contextinput.focus()
        },
      })
      return
    }

    if (ctx.$m.removeTag(this.state.uuid).trim() === '') {
      ctx.alert({
        message: 'Uuid is empty',
        style: 'warning',
        width: '173px',
        onClose: () => {
          this.uuidinput.focus()
        },
      })

      return
    }

    if (this.getValidationState() !== 'success') {
      ctx.alert({
        message: 'Invalid uuid',
        style: 'warning',
        width: '152px',
        onClose: () => {
          this.uuidinput.focus()
        },
      })
      return
    }

    const tagRemovedContent = ctx.$m.removeTag(this.state.content).trim()
    const tagRemovedTitle = ctx.$m.removeTag(this.state.title).trim()

    let post = {
      title:
        tagRemovedTitle === ''
          ? tagRemovedContent.substr(0, ctx.MAXTITLELEN)
          : tagRemovedTitle,
      writer: this.state.writer.trim(),
      content: this.state.content.trim(),
      date: Date.now(),
      isPrivate: this.state.isPrivate,
      isMarkdown: this.state.isMarkdown,
      hasComment: this.state.hasComment,
      uuid: ctx.user.uuid,
      context: this.state.context,
    }

    // 사용자 정보 업데이트
    ctx.setUser({
      uuid: this.state.uuid,
      writer: post.writer,
      hasComment: post.hasComment,
      isMarkdown: post.isMarkdown,
    })

    if (this.props.type === 'edit') {
      Object.assign(post, {
        key: this.state.key,
        viewCnt: this.state.viewCnt,
        likeCnt: this.state.likeCnt,
        commentCnt: this.state.commentCnt,
      })

      ctx.api
        .updatePost(post)
        .then((res) => {
          //if(ctx.view.App.state.data.posts.length > 0){
          if (ctx.store.getState().data.posts.length > 0) {
            ctx.store.dispatch(ctx.action.updatePost(post))
          }

          // 작성된 글 바로 확인
          this.props.history.push(
            '/' + this.state.context + '/post/' + post.key,
          )
        })
        .catch((e) => {
          ctx.alert({
            message: e.message,
            style: 'danger',
          })
        })
    } else {
      Object.assign(post, {
        key: shortid.generate(),
        viewCnt: 0,
        likeCnt: 0,
        commentCnt: 0,
      })

      ctx.api.addPost(post).then((res) => {
        if (
          ctx.store.getState().data.posts.filter((p) => p.origin === undefined)
            .length > 0
        ) {
          if (
            ctx.store.getState().data.posts[0].context !== res.output.context
          ) {
            // 다른 채널에 신규 글을 등록했다면 이전에 store에 등록된 posts 목록은 초기화
            ctx.store.dispatch(ctx.action.initPosts())
          }
          ctx.store.dispatch(ctx.action.addPost(res.output))
        } else {
          // write 화면으로 직접 접근해서 저장하는 경우에는 store에 새글을 추가를 하지 않아도 문제되지 않음
        }

        // 작성된 글 바로 확인
        this.props.history.push('/' + this.state.context + '/post/' + post.key)
      })
    }
  }

  render() {
    //ctx.logger.verbose("Write 렌더링..");

    /**
     * 18.09.20 min9nim
     * 안드로이드(G6) 크롬&파폭일 경우 예외처리 추가
     */
    let height =
      ctx.isDesktop() || navigator.userAgent.match(/android/i)
        ? //(window.innerHeight - 200) + "px"
          /**
           * 18.10.01 min9nim
           * options 버튼 클릭시 스크롤이 생기는 문제 때문에 높이 를 아래와 같이 조정
           */
          window.innerHeight - 250 + 'px'
        : window.innerHeight - 400 + 'px'

    const contentStyle = {
      height, // 핸드폰의 키보드 높이만큼 줄임
      fontSize: this.state && this.state.isMarkdown ? '15px' : '16px',
    }

    const optIcon = this.state.optClicked
      ? 'icon-folder-open-empty'
      : 'icon-folder-empty'

    // ctx.logger.verbose("## this.state.context = " +  this.state.context)

    /**
     * 18.11.17
     * 이 부분에서 자꾸 context 가 사라지는 경우가 있어서 예외처리 추가함
     */
    // if(!this.state.context && ctx.context){
    //   ctx.logger.verbose("context 재설정 ")
    //   this.state.context = ctx.context;
    // }
    /**
     * 18.11.19
     * write 화면에서 채널명 초기화가 안되서 그냥 다시 주석처리함
     */

    return (
      <div className="write">
        {/* <div className="context">{this.props.context || "Anony"}</div> */}
        <FormGroup className="form_title">
          {/*<ControlLabel> Title </ControlLabel>*/}
          <FormControl
            type="text"
            id="title"
            value={this.state.title}
            onChange={this.handleChange}
            ref={(ref) => {
              this.titleinput = ref
            }}
            placeholder="Title.."
          />
          {this.state.title && (
            <div
              className="icon-cancel delete"
              onClick={this.deleteTitle}
              title="Delete title"
            />
          )}
        </FormGroup>
        <FormGroup className="form_writer">
          <FormControl
            type="text"
            className="writer"
            id="writer"
            value={this.state.writer}
            onChange={this.handleChange}
            ref={(ref) => {
              this.writerinput = ref
            }}
            placeholder="Writer.."
          />
          {this.state.writer && (
            <div
              className="icon-cancel delete"
              onClick={this.deleteWriter}
              title="Delete writer"
            />
          )}

          <div
            className={optIcon + ' options'}
            onClick={this.toggleAdvancedOpt}
          >
            {' '}
            options
          </div>
        </FormGroup>
        {this.state.optClicked && (
          <React.Fragment>
            <FormGroup className="form_context">
              <FormControl
                type="text"
                className="context"
                id="context"
                value={this.state.context}
                onChange={this.handleChange}
                ref={(ref) => {
                  this.contextinput = ref
                }}
                placeholder="Channel.."
              />
              {this.state.context && (
                <div
                  className="icon-cancel delete"
                  onClick={this.deleteContext}
                  title="Delete channel"
                />
              )}
            </FormGroup>
            <FormGroup className="form_uuid">
              <FormControl
                type="text"
                className="uuid"
                id="uuid"
                value={this.state.uuid}
                disabled={this.props.type === 'edit'}
                ref={(ref) => {
                  this.uuidinput = ref
                }}
                onChange={this.handleChange}
                placeholder="Uuid.."
              ></FormControl>
              <div className="group_icon">
                <div
                  style={
                    this.props.type === 'edit'
                      ? { cursor: 'not-allowed' }
                      : { cursor: 'pointer' }
                  }
                  className="icon-spin3 refresh"
                  onClick={this.refreshUuid}
                  title="Generate random uuid"
                />
                {this.state.uuid && (
                  <div
                    style={
                      this.props.type === 'edit'
                        ? { cursor: 'not-allowed' }
                        : { cursor: 'pointer' }
                    }
                    className="icon-cancel delete"
                    onClick={this.deleteUuid}
                    title="Delete uuid"
                  />
                )}
              </div>
            </FormGroup>
            <FormGroup className="form_chk">
              <InputGroup.Checkbox
                onChange={this.handleChange}
                id="isMarkdown"
                checked={this.state.isMarkdown}
                title="If you check markdown, you can use markdown syntax"
              >
                Markdown
              </InputGroup.Checkbox>
              <InputGroup.CheckBox
                onChange={this.handleChange}
                id="isPrivate"
                checked={this.state.isPrivate}
                title="If you check private, the article is not exposed on the list. You can only access the URL directly. If you need to access it again, please keep the post URL separately."
              >
                Private
              </InputGroup.CheckBox>
              <InputGroup.CheckBox
                onChange={this.handleChange}
                id="hasComment"
                checked={this.state.hasComment}
                title="If you check comment, you can get comments from others"
              >
                Comment
              </InputGroup.CheckBox>
            </FormGroup>
          </React.Fragment>
        )}
        <FormGroup controlId="content">
          {/*<ControlLabel> Content </ControlLabel>*/}
          <FormControl
            style={contentStyle}
            autoFocus
            ref={(ref) => {
              this.contentinput = ref
            }}
            value={this.state.content}
            onChange={this.handleChange}
            as="textarea"
            placeholder="Content.."
          />
        </FormGroup>
        <Button variant="success" onClick={this.savePost}>
          <i className="icon-floppy" />
          Save
        </Button>
        <Button
          className="write-cancel-btn"
          variant="success"
          onClick={this.cancel}
        >
          <i className="icon-cancel" />
          Cancel
        </Button>
        <div className="help-wrapper">
          <a href="/public/post/BylrBddOOm">
            <div className="icon-help-circled help">How to use</div>
          </a>
        </div>
      </div>
    )
  }
}
