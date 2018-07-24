import React, { Component } from 'react';

class Test extends Component {
  constructor(props){
    super(props);
    this.state = {
      Hello : ""
    }
  }

  componentDidMount(){
    import(/* webpackChunkName: "Hello"  */ "./Hello").then(
      Hello => {
        this.setState({Hello : Hello.default});
      }
    ).catch(err => {console.log(err.message);})
  }

  render() {
    const {Hello} = this.state;

    return (
      <div className="App">
          <h1>Welcome to React</h1>
        {Hello ? <Hello/> : "Loading.."}
      </div>
    );
  }
}

export default Test;
