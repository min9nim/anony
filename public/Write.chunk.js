(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{385:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}(),o=c(n(1)),i=c(n(126)),r=n(184),s=n(185);function c(t){return t&&t.__esModule?t:{default:t}}n(616);var l=function(t){function e(t,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return a.handleChange=a.handleChange.bind(a),a.savePost=a.savePost.bind(a),a.cancel=a.cancel.bind(a),a.state={key:"",title:"",writer:r.tp.user.writer,content:"",date:"",isPrivate:!1,isMarkdown:!1,hasComment:!0,uuid:r.tp.user.uuid},r.tp.view.Write=a,a.contextPath=a.props.context?"/"+a.props.context:"",a}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,o.default.Component),a(e,[{key:"shouldComponentUpdate",value:function(t,e){return e!==this.state}},{key:"componentDidMount",value:function(){document.title=(this.props.context||"Anony")+" - "+r.tp.thispage}},{key:"getValidationState",value:function(){}},{key:"cancel",value:function(){this.state.content.length>10&&!confirm("Cancel to write?")||this.props.history.push(this.contextPath+"/list")}},{key:"handleChange",value:function(t){var e={};e[t.target.id]="checkbox"===t.target.getAttribute("type")?t.target.checked:t.target.value,this.setState(e)}},{key:"savePost",value:function(){var t=this;if(""!==this.state.content){var e={key:i.default.generate(),title:""===this.state.title?this.state.content.trim().substr(0,22):this.state.title.trim(),writer:this.state.writer.trim(),content:this.state.content.trim(),date:Date.now(),isPrivate:this.state.isPrivate,isMarkdown:this.state.isMarkdown,hasComment:this.state.hasComment,uuid:r.tp.user.uuid,context:this.props.context,commentCnt:0};r.tp.api.addPost(e).then(function(n){console.log("# "+n.message),r.tp.store.getState().state.data.posts.filter(function(t){return void 0===t.origin}).length>0&&r.tp.store.dispatch(r.tp.action.addPost(n.output)),r.tp.setUser({writer:e.writer}),t.props.history.push(t.contextPath+"/post/"+e.key)})}else alert("내용을 입력하세요")}},{key:"render",value:function(){console.log("Write 렌더링..");var t={height:r.tp.isDesktop()?window.innerHeight-170+"px":window.innerHeight-400+"px",fontSize:this.state.isMarkdown?"15px":"20px"};return o.default.createElement("div",{className:"write"},o.default.createElement("div",{className:"context"},this.props.context||"Anony"),o.default.createElement(s.FormGroup,{controlId:"title",validationState:this.getValidationState()},o.default.createElement(s.FormControl,{type:"text",value:this.state.title,onChange:this.handleChange,placeholder:"Title.."}),o.default.createElement(s.FormControl.Feedback,null)),o.default.createElement(s.FormGroup,{controlId:"writer"},o.default.createElement(s.FormControl,{type:"text",className:"writer",value:this.state.writer,onChange:this.handleChange,placeholder:"Writer.."}),o.default.createElement(s.Checkbox,{onChange:this.handleChange,id:"isMarkdown",checked:this.state.isMarkdown},"Markdown"),o.default.createElement(s.Checkbox,{onChange:this.handleChange,id:"isPrivate",checked:this.state.isPrivate},"Private"),o.default.createElement(s.Checkbox,{onChange:this.handleChange,id:"hasComment",checked:this.state.hasComment},"Comment")),o.default.createElement(s.FormGroup,{controlId:"content"},o.default.createElement(s.FormControl,{style:t,autoFocus:!0,value:this.state.content,onChange:this.handleChange,componentClass:"textarea",placeholder:"Content.."})),o.default.createElement(s.Button,{bsStyle:"success",onClick:this.savePost},"Save"),o.default.createElement(s.Button,{className:"write-cancel-btn",bsStyle:"success",onClick:this.cancel},"Cancel"))}}]),e}();e.default=l},616:function(t,e,n){var a=n(617);"string"==typeof a&&(a=[[t.i,a,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};n(125)(a,o);a.locals&&(t.exports=a.locals)},617:function(t,e,n){(t.exports=n(124)(!1)).push([t.i,'.write {\n  margin: 20px; }\n  .write div {\n    margin-bottom: 5px; }\n  .write .writer {\n    display: inline-block;\n    width: calc(100% - 265px); }\n  .write .checkbox {\n    margin: 0px 0px 0px 10px;\n    vertical-align: text-bottom;\n    display: inline-block; }\n    .write .checkbox input[type="checkbox"] {\n      -webkit-appearance: checkbox; }\n  .write input {\n    font-size: 20px; }\n  .write .write-cancel-btn {\n    margin-left: 3px; }\n',""])}}]);