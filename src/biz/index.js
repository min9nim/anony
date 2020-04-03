import { go, highlight as mark } from 'mingutils'

export function nl2br(str) {
  // 마크다운에서 인용부호 사용시 인용부호 밖으로 벗어날 수 있는 방법이 없어서 아래를 주석처리함

  /*
   * 18.09.05
   * 아래 highlight_nl2br 에서 코드영역에대한 replace 는 제외하도록 코딩이 되어있으므로 개행문자 <br>처리 문장을 다시 주석 해제함
   */
  //return str.replace(/\n\n\n/g, "\n<br><br>\n").replace(/\n\n/g, "\n<br>\n");
  return str
    .replace(/\n\n\n\n/g, '\n<br><br>\n\n')
    .replace(/\n\n\n/g, '\n<br>\n\n')
  //return str;
}

export function highlight_nl2br(str, word) {
  // 마크다운의 코드서식 텍스트에는 검색결과 highlight표시 안하도록 예외 처리
  return str
    .split('```')
    .map((v, i) =>
      i % 2
        ? v
        : v
            .split('`')
            .map((v, i) => (i % 2 ? v : nl2br(mark(word)(v))))
            .join('`'),
    )
    .join('```')
}

export function highlight(str, lang) {
  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed

  if (ctx.hljs === undefined) {
    import(/* webpackChunkName: "highlightjs"  */ 'highlight.js')
      .then(m => {
        ctx.hljs = m.default
        //this.render();    // 이렇게 한다고 화면이 실제로 다시 그려지지는 않음
        this.setState(this.state)
      })
      .catch(err => console.log(err.message))
    return 'code is loading..'
  }
  if (lang && ctx.hljs.getLanguage(lang)) {
    try {
      return ctx.hljs.highlight(lang, str).value
    } catch (err) {
      //console.log(err.message);
    }
  }
  try {
    return ctx.hljs.highlightAuto(str).value
  } catch (err) {
    //console.log(err.message);
  }
  return '' // use external default escaping
}

export async function directAccess(postKey) {
  // 3. 직접URL로 치고 들어온 경우
  // - viewPost 호출한 후에 getPost로 응답결과를 그냥 화면에 보여주면 됨
  // - store 업데이트 필요없음
  const res = await ctx.api.viewPost(postKey)
  if (res.status == 'Success') {
    /**
     * 18.11.09
     *
     * URL로 직접 들어온 경우에 context 정보는 URL 주소값에서 가지고 오도록 한다
     * URL로 직접 access하는 경우에는 context 정보가 민감한 정보알 수 있기 때문에 서버에서 의도적으로 내려주지 않는다
     */
    //Object.assign(res.output, { context: this.props.context })
    Object.assign(res.output, { context: ctx.context })

    ctx.store.dispatch(ctx.action.addPost(res.output))
  } else {
    // 수정내역post 인 경우
    ctx.api
      .getPost(postKey)
      //.then(R.pipe(ctx.checkStatus, R.prop("post"), ctx.action.addPost, ctx.store.dispatch))
      .then(prop('post'))
      .then(ctx.action.addPost)
      .then(ctx.store.dispatch)
      .catch(e => {
        //console.log(e.message)
      })
  }
}

export async function spaAccess(postDate, postKey) {
  // 목록/수정 화면에서 넘어 들어온 경우
  const diff = Date.now() - postDate // 여기서 state 가 undefined 인 경우가 있다???
  if (diff < 1000) {
    // 1. 글등록이나 수정하고 바로 들어온 경우
    // 조회수 증가 처리 필요없고, 스토어 업데이트도 필요없음
    return
  }
  // 2. List 에서 글 선택해서 들어온 경우
  const { posts } = ctx.store.getState().data
  if (posts.length <= 1) {
    // 3.직접URL로 들어온 후 ctx.api.viewPost 호출하고 store업데이트 된 후 화면 다시 그리면서 이쪽으로 들어올 수 있음
    return
  }
  const res = await ctx.api.viewPost(postKey)
  if (res.status !== 'Success') {
    // 수정내역post 인 경우
    return
  }
  // 일반post 인 경우
  ctx.store.dispatch(ctx.action.viewPost(postKey))
  // 여기서 스토어를 업데이트하면 다시 App 부터 리렌더링되면서 로직이 꼬이게 됨, 18.07.25
  // 위에 주석처리하면 목록에서 글보기화면 넘어올 때 viewCnt 가 올라가지 않아서 다시 주석해제 함, 18.08.17

  go(
    Object.assign(res.output, { context: ctx.context }),
    ctx.action.updatePost,
    ctx.store.dispatch,
  )
  //ctx.store.dispatch(ctx.action.updatePost(Object.assign(res.output, {context: ctx.context}))
}

export async function editPost(history, contextPath, postKey) {
  const res = await ctx.api.authPost({
    key: postKey,
    uuid: ctx.user.uuid,
  })
  if (res.status !== 'Success') {
    ctx.alert({
      message: res.message,
      style: 'warning',
      width: '160px',
    })
    //this.cancelMenu();
    return
  }
  history.push(contextPath + '/edit/' + postKey)
}
