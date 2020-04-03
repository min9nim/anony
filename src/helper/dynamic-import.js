import React from 'react'
import { Loading } from '@/components'

const cache = {} // 비동기 컴포넌트 캐시

const dynamicImport = {
  List: () => import('../pages/List'),
  Write: () => import('../pages/Write'),
  Post: () => import('../pages/Post'),
  PostHistory: () => import('../pages/PostHistory'),
}

// Ref) https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
export function asyncComponent(name) {
  return class AsyncComponent extends React.Component {
    //static Component = null;
    constructor(props) {
      super(props)
      this.state = { Component: cache[name] }
    }

    async componentDidMount() {
      if (this.state.Component) {
        ctx.logger.verbose(`## cache[${name}] used`)
        return
      }
      const module = await dynamicImport[name]()
      cache[name] = module.default
      this.setState({ Component: module.default })
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return <Loading name={name} />
    }
  }
}

export function render(componentName) {
  return ({ history, match }) => {
    ctx.thispage = componentName
    let name = componentName
    let type
    if (componentName === 'Edit') {
      name = 'Write'
      type = 'edit'
    }
    const Component = asyncComponent(name)
    return (
      <Component
        type={type}
        history={history}
        match={match}
        postKey={match.params.key}
        context={match.params.context}
      />
    )
  }
}
