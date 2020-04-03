import React from 'react'

const cache = {} // 비동기 컴포넌트 캐시

const dynamicImport = {
  List: () => import('../pages/List'),
  Write: () => import('../pages/Write'),
  Post: () => import('../pages/Post'),
  PostHistory: () => import('../pages/PostHistory'),
}

//Ref) https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
export function asyncComponent(name) {
  return class AsyncComponent extends React.Component {
    //static Component = null;
    constructor(props) {
      super(props)
      this.state = { Component: cache[name] }
    }

    componentWillMount() {
      if (this.state.Component) {
        console.log(`## cache[${name}] used`)
        return
      }
      dynamicImport[name]().then(m => {
        cache[name] = m.default
        this.setState({ Component: m.default })
      })
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return (
        <div>
          <i className="icon-spin3 animate-spin"></i> Loading.. [{name}]
        </div>
      )
    }
  }
}

export function render(componentName) {
  return ({ history, match }) => {
    tp.thispage = componentName
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
