(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{241:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=l(n(1)),a=l(n(51)),s=n(22),r=n(29);function l(t){return t&&t.__esModule?t:{default:t}}n(470);var c=function(t){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var n=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return n.handleChange=n.handleChange.bind(n),n.savePost=n.savePost.bind(n),n.cancel=n.cancel.bind(n),n.refreshUuid=n.refreshUuid.bind(n),n.deleteUuid=n.deleteUuid.bind(n),n.deleteContext=n.deleteContext.bind(n),n.deleteTitle=n.deleteTitle.bind(n),n.deleteWriter=n.deleteWriter.bind(n),n.toggleAdvancedOpt=n.toggleAdvancedOpt.bind(n),n.state={key:"",title:"",writer:s.tp.user.writer,content:"",date:"",isPrivate:!1,isMarkdown:void 0!==s.tp.user.isMarkdown&&s.tp.user.isMarkdown,hasComment:void 0===s.tp.user.hasComment||s.tp.user.hasComment,uuid:s.tp.user.uuid,context:n.props.context?n.props.context:"public",optClicked:!1,autoTitle:"edit"!==n.props.type},"edit"===n.props.type&&n.initializeInEdit(),n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,o.default.Component),i(e,[{key:"initializeInEdit",value:function(){var t=this;s.tp.store.getState().data.posts.length>0?(this.state=s.tp.store.getState().data.posts.find(function(e){return e.key===t.props.postKey}),this.state.uuid=s.tp.user.uuid):s.tp.api.getPost(this.props.postKey).then(function(e){t.state.uuid=s.tp.user.uuid,s.tp.store.dispatch(s.tp.action.addPost(e.post))}),this.unsubscribe=s.tp.store.subscribe(function(){console.log("Edit가 store 상태변경 노티 받음"),""===t.state.key&&t.setState(s.tp.store.getState().data.posts.find(function(e){return e.key===t.props.postKey}))})}},{key:"componentWillUnmount",value:function(){"edit"===this.props.type&&(console.log("# Edit unsubscribe store.."),this.unsubscribe())}},{key:"shouldComponentUpdate",value:function(t,e){return"edit"===t.type&&void 0!==e.origin?(alert("Invalid access!"),t.history.push("/public/list"),!1):e!==this.state}},{key:"getValidationState",value:function(){var t=s.tp.$m.removeTag(this.state.uuid).trim().length;return a.default.isValid(this.state.uuid)&&t>=9?"success":t>5?"warning":t>0?"error":null}},{key:"componentDidMount",value:function(){document.title=this.props.context+" - "+s.tp.thispage}},{key:"toggleAdvancedOpt",value:function(){this.setState({optClicked:!this.state.optClicked})}},{key:"cancel",value:function(){var t=this;if("edit"===this.props.type){var e=location.pathname.split("/");e.splice(e.indexOf("edit"),1,"post"),this.props.history.push(e.join("/"))}else this.state.content.length>10?s.tp.confirm({message:"Cancel to write?",style:"danger",width:"170px",onYes:function(){"/"===location.pathname?t.props.history.push("/public/list"):history.back()}}):"/"===location.pathname?this.props.history.push("/public/list"):history.back()}},{key:"handleChange",value:function(t){if(!("uuid"===t.target.id&&t.target.value.length>s.tp.MAXUUIDLEN||"context"===t.target.id&&t.target.value.length>s.tp.MAXCONTEXTLEN)){"title"===t.target.id&&(this.state.autoTitle=!1),!this.state.autoTitle&&""!==this.state.title||"content"!==t.target.id||(t.target.value.length<=s.tp.MAXTITLELEN?this.state.title=t.target.value:(this.state.title=t.target.value.substr(0,s.tp.MAXTITLELEN),this.state.autoTitle=!1));var e={};e[t.target.id]="checkbox"===t.target.getAttribute("type")?t.target.checked:t.target.value,this.setState(e)}}},{key:"refreshUuid",value:function(){"edit"===this.props.type||this.setState({uuid:a.default.generate()})}},{key:"deleteUuid",value:function(){"edit"===this.props.type||(this.setState({uuid:""}),this.uuidinput.focus())}},{key:"deleteContext",value:function(){this.setState({context:""}),this.contextinput.focus()}},{key:"deleteTitle",value:function(){this.setState({title:""}),this.titleinput.focus()}},{key:"deleteWriter",value:function(){this.setState({writer:""}),this.writerinput.focus()}},{key:"savePost",value:function(){var t=this;if(""!==s.tp.$m.removeTag(this.state.content).trim())if(""!==s.tp.$m.removeTag(this.state.context).trim())if(""!==s.tp.$m.removeTag(this.state.uuid).trim())if("success"===this.getValidationState()){var e=s.tp.$m.removeTag(this.state.content).trim(),n=s.tp.$m.removeTag(this.state.title).trim(),i={title:""===n?e.substr(0,s.tp.MAXTITLELEN):n,writer:this.state.writer.trim(),content:this.state.content.trim(),date:Date.now(),isPrivate:this.state.isPrivate,isMarkdown:this.state.isMarkdown,hasComment:this.state.hasComment,uuid:s.tp.user.uuid,context:this.state.context};s.tp.setUser({uuid:this.state.uuid,writer:i.writer,hasComment:i.hasComment,isMarkdown:i.isMarkdown}),"edit"===this.props.type?(Object.assign(i,{key:this.state.key,viewCnt:this.state.viewCnt,likeCnt:this.state.likeCnt,commentCnt:this.state.commentCnt}),s.tp.api.updatePost(i).then(function(e){"Fail"!==e.status?(s.tp.store.getState().data.posts.length>0&&s.tp.store.dispatch(s.tp.action.updatePost(i)),t.props.history.push("/"+t.state.context+"/post/"+i.key)):s.tp.alert({message:e.message,style:"danger"})})):(Object.assign(i,{key:a.default.generate(),viewCnt:0,likeCnt:0,commentCnt:0}),s.tp.api.addPost(i).then(function(e){s.tp.store.getState().data.posts.filter(function(t){return void 0===t.origin}).length>0&&(s.tp.store.getState().data.posts[0].context!==e.output.context&&s.tp.store.dispatch(s.tp.action.initPosts()),s.tp.store.dispatch(s.tp.action.addPost(e.output))),t.props.history.push("/"+t.state.context+"/post/"+i.key)}))}else s.tp.alert({message:"Invalid uuid",style:"warning",width:"152px",onClose:function(){t.uuidinput.focus()}});else s.tp.alert({message:"Uuid is empty",style:"warning",width:"173px",onClose:function(){t.uuidinput.focus()}});else s.tp.alert({message:"Channel is empty",style:"warning",width:"176px",onClose:function(){t.contextinput.focus()}});else s.tp.alert({message:"Content is empty",style:"warning",width:"173px",onClose:function(){t.contentinput.focus()}})}},{key:"render",value:function(){var t=this;console.log("Write 렌더링..");var e={height:s.tp.isDesktop()||navigator.userAgent.match(/android/i)?window.innerHeight-250+"px":window.innerHeight-400+"px",fontSize:this.state&&this.state.isMarkdown?"15px":"20px"},n=this.state.optClicked?"icon-folder-open-empty":"icon-folder-empty";return o.default.createElement("div",{className:"write"},o.default.createElement(r.FormGroup,{className:"form_title"},o.default.createElement(r.FormControl,{type:"text",id:"title",value:this.state.title,onChange:this.handleChange,inputRef:function(e){t.titleinput=e},placeholder:"Title.."}),this.state.title&&o.default.createElement("div",{className:"icon-cancel delete",onClick:this.deleteTitle,title:"Delete title"})),o.default.createElement(r.FormGroup,{className:"form_writer"},o.default.createElement(r.FormControl,{type:"text",className:"writer",id:"writer",value:this.state.writer,onChange:this.handleChange,inputRef:function(e){t.writerinput=e},placeholder:"Writer.."}),this.state.writer&&o.default.createElement("div",{className:"icon-cancel delete",onClick:this.deleteWriter,title:"Delete writer"}),o.default.createElement("div",{className:n+" options",onClick:this.toggleAdvancedOpt}," options")),this.state.optClicked&&o.default.createElement(o.default.Fragment,null,o.default.createElement(r.FormGroup,{className:"form_context"},o.default.createElement(r.FormControl,{type:"text",className:"context",id:"context",value:this.state.context,onChange:this.handleChange,inputRef:function(e){t.contextinput=e},placeholder:"Channel.."}),this.state.context&&o.default.createElement("div",{className:"icon-cancel delete",onClick:this.deleteContext,title:"Delete channel"})),o.default.createElement(r.FormGroup,{className:"form_uuid"},o.default.createElement(r.FormControl,{type:"text",className:"uuid",id:"uuid",value:this.state.uuid,disabled:"edit"===this.props.type,inputRef:function(e){t.uuidinput=e},onChange:this.handleChange,placeholder:"Uuid.."}),o.default.createElement("div",{className:"group_icon"},o.default.createElement("div",{style:"edit"===this.props.type?{cursor:"not-allowed"}:{cursor:"pointer"},className:"icon-spin3 refresh",onClick:this.refreshUuid,title:"Generate random uuid"}),this.state.uuid&&o.default.createElement("div",{style:"edit"===this.props.type?{cursor:"not-allowed"}:{cursor:"pointer"},className:"icon-cancel delete",onClick:this.deleteUuid,title:"Delete uuid"}))),o.default.createElement(r.FormGroup,{className:"form_chk"},o.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"isMarkdown",checked:this.state.isMarkdown,title:"If you check markdown, you can use markdown syntax"},"Markdown"),o.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"isPrivate",checked:this.state.isPrivate,title:"If you check private, the article is not exposed on the list. You can only access the URL directly. If you need to access it again, please keep the post URL separately."},"Private"),o.default.createElement(r.Checkbox,{onChange:this.handleChange,id:"hasComment",checked:this.state.hasComment,title:"If you check comment, you can get comments from others"},"Comment"))),o.default.createElement(r.FormGroup,{controlId:"content"},o.default.createElement(r.FormControl,{style:e,autoFocus:!0,inputRef:function(e){t.contentinput=e},value:this.state.content,onChange:this.handleChange,componentClass:"textarea",placeholder:"Content.."})),o.default.createElement(r.Button,{bsStyle:"success",onClick:this.savePost},o.default.createElement("i",{className:"icon-floppy"}),"Save"),o.default.createElement(r.Button,{className:"write-cancel-btn",bsStyle:"success",onClick:this.cancel},o.default.createElement("i",{className:"icon-cancel"}),"Cancel"),o.default.createElement("div",{className:"help-wrapper"},o.default.createElement("a",{href:"/public/post/BylrBddOOm"},o.default.createElement("div",{className:"icon-help-circled help"},"How to use"))))}}]),e}();e.default=c},470:function(t,e,n){var i=n(471);"string"==typeof i&&(i=[[t.i,i,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};n(15)(i,o);i.locals&&(t.exports=i.locals)},471:function(t,e,n){(t.exports=n(14)(!1)).push([t.i,'.write {\n  margin: 20px;\n  color: #666; }\n  .write div {\n    margin-bottom: initial; }\n  .write .form_title {\n    position: relative;\n    display: inline-block;\n    width: 100%; }\n    .write .form_title input {\n      padding-right: 12px; }\n    .write .form_title .delete {\n      font-size: 15px;\n      font-weight: bold;\n      position: absolute;\n      display: inline;\n      color: #999;\n      top: 8px;\n      right: 5px;\n      cursor: pointer; }\n  .write .form_writer {\n    position: relative; }\n    .write .form_writer .writer {\n      display: inline-block;\n      width: calc(100% - 90px);\n      margin-right: 5px; }\n    .write .form_writer .delete {\n      font-size: 15px;\n      font-weight: bold;\n      position: absolute;\n      display: inline;\n      color: #999;\n      top: 8px;\n      left: calc(100% - 116px);\n      cursor: pointer; }\n  .write .options {\n    display: inline-block;\n    margin-left: 10px;\n    margin-bottom: 6px;\n    cursor: pointer; }\n    .write .options:hover {\n      transform: scale(1.05);\n      -webkit-transform: scale(1.05); }\n  .write .form_context {\n    position: relative;\n    display: inline-block;\n    width: calc(100% - 210px);\n    margin-right: 5px; }\n    .write .form_context .context {\n      display: inline-block;\n      width: 100%; }\n    .write .form_context .delete {\n      font-size: 15px;\n      font-weight: bold;\n      position: absolute;\n      display: inline;\n      color: #999;\n      top: 8px;\n      left: calc(100% - 25px);\n      cursor: pointer; }\n  .write .form_uuid {\n    display: inline-block;\n    position: relative; }\n    .write .form_uuid .uuid {\n      display: inline-block;\n      width: 200px;\n      margin-right: 5px; }\n    .write .form_uuid .group_icon {\n      position: absolute;\n      left: 153px;\n      top: 7px; }\n      .write .form_uuid .group_icon .form-control-feedback {\n        position: relative;\n        display: inline;\n        margin-right: 3px; }\n      .write .form_uuid .group_icon .delete {\n        font-size: 15px;\n        font-weight: bold;\n        display: inline;\n        color: #999;\n        cursor: pointer;\n        margin-right: 3px; }\n      .write .form_uuid .group_icon .refresh {\n        font-size: 15px;\n        font-weight: bold;\n        display: inline;\n        color: #999;\n        cursor: pointer; }\n  .write .form_chk {\n    margin-bottom: 3px; }\n    .write .form_chk .checkbox {\n      margin: 0px 10px 0px 5px;\n      vertical-align: text-bottom;\n      display: inline-block; }\n      .write .form_chk .checkbox input[type="checkbox"] {\n        -webkit-appearance: checkbox; }\n  .write input {\n    font-size: 18px; }\n  .write .write-cancel-btn {\n    margin-left: 3px; }\n  .write .form-control {\n    color: #777;\n    margin-bottom: 5px; }\n  .write .btn {\n    padding-top: 2px;\n    padding-bottom: 2px;\n    padding-left: 2px;\n    padding-right: 8px; }\n  .write .help-wrapper {\n    text-align: right; }\n    .write .help-wrapper .help {\n      display: inline; }\n',""])}}]);