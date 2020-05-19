import nprogress from 'nprogress'
import $m from '@@/com/util'
import { observeDom } from '@/biz/utils'
import { prop, isNil, pipe, last } from 'ramda'

const PAGEROWS = 10

const originIsNil = pipe(
  prop('origin'),
  isNil,
)

export const needToFetch = (props) => {
  // 처음부터 글쓰기로 글을 생성하고 들어오거나 글보기 상태에서 새로고침 후 목록으로 들어갈 때, 이 경우는 어짜피 무한스크롤에 의해서 이후 목록을 로드하므로 0번째부터 데이터를 로드할 필요가 없음(duplicate key 오류 발생 )
  const condition1 =
    props.state.data.posts.filter(originIsNil).length <= 1 &&
    props.state.view.search === ''
  const condition2 = // 글수정화면에서 context를 수정한 경우(posts에 context 가 2개 이상 포함된 경우)
    props.state.data.posts
      .map(prop('context'))
      .filter((value, index, array) => array.indexOf(value) === index).length >
    1
  console.log('###', { condition1, condition2 })
  return !condition1 || condition2
}

export function fetchList(props, posts, setLoading) {
  return async () => {
    props.logger.info('last one show up', posts.length)

    nprogress.start()
    $m('#nprogress .spinner').css('top', '95%')
    setLoading(true)

    const res = await ctx.api.getPosts({
      idx: posts.length,
      cnt: PAGEROWS,
      search: props.state.view.search,
      hideProgress: true,
      context: ctx.context,
    })

    setLoading(false)

    props.addPosts(res.posts)
    if (res.posts.length < PAGEROWS) {
      props.logger.verbose('Scroll has touched bottom')
      ctx.noMore = true
      return
    }
  }
}

export function infiniteLoadingEffect(props, setLoading) {
  const posts = props.state.data.posts.filter(originIsNil)
  return () => {
    props.logger.verbose('[effect-in] infinite loading')
    ctx.$m.scrollTo(0, ctx.scrollTop) // 이전 스크롤 위치로 복원

    const lastPost = last(document.querySelectorAll('.list > .excerpt'))

    if (!lastPost) {
      props.logger.warn('not found lastPost')
      return () => {}
    }
    if (ctx.noMore) {
      props.logger.info('no more data')
      return
    }
    props.logger.info('observe last one')

    const unobserve = observeDom(lastPost, fetchList(props, posts, setLoading))
    return () => {
      props.logger.verbose('[effect-out] infinite loading')

      // 현재 목록화면 scrollTop 의 값
      ctx.scrollTop = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )

      if (lastPost.observed) {
        props.logger.info('unobserve last one')
        unobserve()
      }
    }
  }
}

export function initializeEffect(props) {
  const posts = props.state.data.posts.filter(
    pipe(
      prop('origin'),
      isNil,
    ),
  )
  return () => {
    props.logger.verbose('[effect-in] initialize')
    ctx.scrollTop = 0 // 스크롤 위치 초기화
    document.title = (ctx.context || 'Anony') + ' - ' + ctx.thispage

    if (props.context && props.context.length > ctx.MAXCONTEXTLEN) {
      alert(`채널이름은 최대 ${ctx.MAXCONTEXTLEN}자 까지 가능합니다`)
      history.back()
      return
    }

    // if (needToFetch(props, posts)) {
    //   props.setPostsAsync({ idx: 0, cnt: 10, context: ctx.context })
    // }

    // 목록 초기화하고 전체 처음부터 다시 로드
    props.setPosts([])
    props.setPostsAsync({ idx: 0, cnt: 10, context: ctx.context })
  }
}
