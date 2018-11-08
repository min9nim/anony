import React from "react";
import "./Menu.scss";
import MenuEditUuid from './MenuEditUuid';

export default class Menu extends React.Component {
    constructor(props) {
        //console.log("PostMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);

        this.state = {
            clicked : false
        }
    }

    hideMenu(){
        this.setState({clicked: false});
    }

    showMenu(){
        this.setState({clicked: true});
    }

    render(){
        //console.log("Menu 렌더링");
        return (
            <div className="menu">
                <div className="icon-menu-1 navi" onClick={this.showMenu}></div>
                {this.state.clicked && <MenuEditUuid hideMenu={this.hideMenu} />}
            </div>
        );
    }
}
