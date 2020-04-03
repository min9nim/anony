import React from 'react'

const cache = {} // 비동기 컴포넌트 캐시

//Ref) https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
export function asyncComponent(getComponent, compname) {
  return class AsyncComponent extends React.Component {
    //static Component = null;
    constructor(props) {
      super(props)
      this.state = { Component: cache[compname] }
    }

    componentWillMount() {
      if (this.state.Component) {
        console.log(`## cache[${compname}] used`)
        return
      }
      getComponent().then(m => {
        //console.log("@@@@@ 동적로딩이요~");
        //AsyncComponent.Component = m.default;
        cache[compname] = m.default
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
          <i className="icon-spin3 animate-spin"></i> Loading.. [{compname}]
        </div>
      )
    }
  }
}

const MAP = {
  List: () => import('../pages/List'),
  Write: () => import('../pages/Write'),
  Post: () => import('../pages/Post'),
  PostHistory: () => import('../pages/PostHistory'),
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
    const Component = asyncComponent(MAP[name], './pages/' + name)
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
