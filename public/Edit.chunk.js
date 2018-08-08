(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{384:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(t){return t&&t.__esModule?t:{default:t}}(n(1)),i=n(184),s=n(82),r=n(185);n(614);var l=function(t){function e(t,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var o=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return o.handleChange=o.handleChange.bind(o),o.savePost=o.savePost.bind(o),i.tp.store.getState().data.posts.length>0?(o.state=i.tp.store.getState().data.posts.find(function(t){return t.key===o.props.postKey}),o.state.uuid=i.tp.user.uuid,void 0!==o.state.origin&&(alert("invalid access!"),history.back())):i.tp.api.getPost(o.props.postKey).then(function(t){o.state=t.post,o.state.uuid=i.tp.user.uuid,i.tp.store.dispatch(i.tp.action.addPost(t.post))}),o.contextPath=o.props.context?"/"+o.props.context:"",o.unsubscribe=i.tp.store.subscribe(function(){console.log("Edit가 store 상태변경 노티 받음"),o.setState(i.tp.store.getState().data.posts.find(function(t){return t.key===o.props.postKey}))}),o}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,a.default.Component),o(e,[{key:"componentWillUnmount",value:function(){console.log("# Edit unsubscribe store.."),this.unsubscribe()}},{key:"shouldComponentUpdate",value:function(t,e){return!0}},{key:"componentDidMount",value:function(){document.title=(this.props.context||"Anony")+" - "+i.tp.thispage}},{key:"getValidationState",value:function(){}},{key:"handleChange",value:function(t){var e={};e[t.target.id]="checkbox"===t.target.getAttribute("type")?t.target.checked:t.target.value,this.setState(e)}},{key:"savePost",value:function(){var t=this;if(""!==this.state.content){var e={key:this.state.key,title:""===this.state.title?this.state.content.trim().substr(0,17):this.state.title.trim(),writer:this.state.writer.trim(),content:this.state.content.trim(),date:Date.now(),isPrivate:this.state.isPrivate,isMarkdown:this.state.isMarkdown,hasComment:this.state.hasComment,viewCnt:this.state.viewCnt,uuid:i.tp.user.uuid,context:this.state.context};i.tp.api.updatePost(e).then(function(n){"Fail"!==n.status?(console.log("# "+n.message),i.tp.store.getState().data.posts.length>0&&i.tp.store.dispatch(i.tp.action.updatePost(e)),i.tp.setUser({writer:e.writer}),t.props.history.push(t.contextPath+"/post/"+e.key)):alert(JSON.stringify(n,null,2))})}else alert("내용을 입력하세요")}},{key:"render",value:function(){if(console.log("Write 렌더링.."),!this.state)return a.default.createElement("div",null);var t={height:i.tp.isDesktop()?window.innerHeight-170+"px":window.innerHeight-400+"px",fontSize:this.state.isMarkdown?"15px":"20px"};return a.default.createElement("div",{className:"edit"},a.default.createElement("div",{className:"context"},this.props.context||"Anony"),a.default.createElement(r.FormGroup,{controlId:"title",validationState:this.getValidationState()},a.default.createElement(r.FormControl,{type:"text",autoFocus:!0,value:this.state.title,onChange:this.handleChange,placeholder:"Title.."}),a.default.createElement(r.FormControl.Feedback,null)),a.default.createElement(r.FormGroup,{controlId:"writer"},a.default.createElement(r.FormControl,{type:"text",className:"writer",value:this.state.writer,onChange:this.handleChange,placeholder:"Writer.."}),a.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"isMarkdown",checked:this.state.isMarkdown},"Markdown"),a.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"isPrivate",checked:this.state.isPrivate},"Private"),a.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"hasComment",checked:this.state.hasComment},"Comment")),a.default.createElement(r.FormGroup,{controlId:"content"},a.default.createElement(r.FormControl,{style:t,value:this.state.content,onChange:this.handleChange,componentClass:"textarea",placeholder:"Content.."})),a.default.createElement(r.Button,{bsStyle:"success",onClick:this.savePost},"Save"),a.default.createElement(s.Link,{to:this.contextPath+"/post/"+this.state.key},a.default.createElement(r.Button,{className:"write-cancel-btn",bsStyle:"success"},"Cancel")))}}]),e}();e.default=l},614:function(t,e,n){var o=n(615);"string"==typeof o&&(o=[[t.i,o,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};n(125)(o,a);o.locals&&(t.exports=o.locals)},615:function(t,e,n){(t.exports=n(124)(!1)).push([t.i,'.edit {\n  margin: 20px; }\n  .edit div {\n    margin-bottom: 5px; }\n  .edit .writer {\n    display: inline-block;\n    width: calc(100% - 265px); }\n  .edit .checkbox {\n    margin: 0px 0px 0px 10px;\n    vertical-align: text-bottom;\n    display: inline-block; }\n    .edit .checkbox input[type="checkbox"] {\n      -webkit-appearance: checkbox; }\n  .edit .content {\n    font-size: 20px;\n    height: 210px; }\n  .edit input {\n    font-size: 20px; }\n  .edit .write-cancel-btn {\n    margin-left: 3px; }\n',""])}}]);