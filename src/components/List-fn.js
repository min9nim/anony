import nprogress from 'nprogress'
import $m from '@@/com/util'

const PAGEROWS = 10

export const needToFetch = (props) =>
  // 처음부터 글쓰기로 글을 생성하고 들어온 경우
  (props.state.data.posts.filter((p) => p.origin === undefined).length <= 1 &&
    props.state.view.search === '') ||
  // 글수정화면에서 context를 수정한 경우(posts에 context 가 2개 이상 포함된 경우)
  props.state.data.posts
    .map((p) => p.context)
    .filter((value, index, array) => array.indexOf(value) === index).length > 1

export function fetchList(props, posts, lastPost, state, setState) {
  return async () => {
    props.logger.info('last one show up', posts.length)

    nprogress.start()
    $m('#nprogress .spinner').css('top', '95%')
    setState({ ...state, loading: true })

    const res = await ctx.api.getPosts({
      idx: posts.length,
      cnt: PAGEROWS,
      search: props.state.view.search,
      hideProgress: true,
      context: ctx.context,
    })
    // if (lastPost.observed) {
    //   props.logger.info('unobserve last one')
    //   unobserve()
    // }

    setState({ ...state, loading: false })

    props.scrollEnd(res.posts)
    if (res.posts.length < PAGEROWS) {
      props.logger.verbose('Scroll has touched bottom')
      ctx.noMore = true
      return
    }
  }
}
