import React from 'react'
import action from './redux/action'
import { api } from './restful/api'
import shortid from 'shortid'
import $m from '../com/util'
import nprogress from 'nprogress'

const USECOOKIE = true

export let tp = {
  view: {}, // 전역에서 관리될 필요가 있는 리액트 뷰들
  action, // store 상태업데이트시 전달될 action
  store: undefined, // List 컴포넌트가 호출될 때 store 가 초기화된다.
  user: undefined, // 로컬스토리지에 저장된 사용자 정보
  api, // RESTful API
  nprogress, // 서버통신시 진행표시
  isScrollLast: false, // 세로 스크롤이 마지막까지 도달했는지 여부
  temp: undefined, // 컴포넌트간 정보 전달을 위한 임시 저장 공간
  $m, // 기본 유틸함수
  hljs: undefined, // 마크다운 코드 하이라이트처리(필요할 때 동적으로 로딩함)
  scrollTop: 0, // list 화면에서 현재 스크롤 위치
  MAXCONTEXTLEN: 16, // 컨텍스트명 최대 길이
  MAXUUIDLEN: 10, // uuid 최대길이
  MAXTITLELEN: 20, // 글제목 최대길이
}

export const Ctx = React.createContext({})

// tp.checkStatus = function(res) {
//   if (res.status === 'Success') {
//     return res
//   }
//   // 정상적인 경우가 아니라 간주하고 예외 발생시킴
//   tp.alert({
//     message: res.message,
//     style: 'danger',
//     width: '200px',
//   })
//   return new Promise(function(resolve, reject) {
//     reject(new Error(res.message))
//   })
// }

tp.setCookie = function(cname, cvalue, exdays = 1000) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

tp.getCookie = function(cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

tp.isDesktop = function() {
  const os = ['win16', 'win32', 'win64', 'mac', 'macintel']
  return os.includes(navigator.platform.toLowerCase())
}

tp.isMobileChrome = function() {
  return !tp.isDesktop() && navigator.userAgent.includes('Chrome')
}

tp.highlight = function(txt, word) {
  if (word) {
    var reg = new RegExp('(' + word + ')', 'gi')
    txt = txt.replace(reg, '<span style="background-color:yellow;">$1</span>')
  }
  return txt
}

tp.setUser = function(obj) {
  const initValue = {
    uuid: shortid.generate(),
    writer: '',
  }

  let user
  if (typeof obj === 'string') {
    user = Object.assign(tp.user, { uuid: obj })
  } else {
    user = obj ? Object.assign(tp.user, obj) : initValue
  }

  if (USECOOKIE) {
    tp.setCookie('user', JSON.stringify(user))
  } else {
    localStorage.setItem('user', JSON.stringify(user))
  }

  tp.store && tp.store.dispatch(tp.action.setUuid(tp.user.uuid))

  return user
}

tp.getUser = function() {
  try {
    if (USECOOKIE) {
      return tp.getCookie('user')
        ? JSON.parse(tp.getCookie('user'))
        : tp.setUser()
    } else {
      return JSON.parse(localStorage.getItem('user')) || tp.setUser()
    }
  } catch (e) {
    //console.log(e.message);
    return tp.setUser()
  }
}

tp.alert = function({ message, style, width, onClose }) {
  if (typeof arguments[0] === 'string') {
    tp.view.AlertDismissable.handleShow({ message: arguments[0] })
  } else {
    tp.view.AlertDismissable.handleShow({
      message,
      style,
      width,
      onClose,
    })
  }
}

tp.confirm = function({ message, style, width, onYes, onNo }) {
  tp.view.Confirm.handleShow({
    message,
    style,
    width,
    onYes,
    onNo,
  })
}

tp.init = function() {
  tp.user = tp.getUser()
}

tp.init()
window.tp = tp // 개발 중 디버깅을 위해 전역공간으로 노출
