import React from 'react'
import action from '../redux/action'
import { api } from '../restful/api'
import shortid from 'shortid'
import $m from '../../com/util'
import createLogger, { simpleFormat } from 'if-logger'
import nprogress from 'nprogress'
import moment from 'moment'

const USECOOKIE = true

export const ctx = {
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
  logger: createLogger({
    format: simpleFormat,
    tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
  }),
}

export const Ctx = React.createContext({})

ctx.setCookie = function (cname, cvalue, exdays = 1000) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

ctx.getCookie = function (cname) {
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

ctx.isDesktop = function () {
  const os = ['win16', 'win32', 'win64', 'mac', 'macintel']
  return os.includes(navigator.platform.toLowerCase())
}

ctx.isMobileChrome = function () {
  return !ctx.isDesktop() && navigator.userAgent.includes('Chrome')
}

ctx.setUser = function (obj) {
  const initValue = {
    uuid: shortid.generate(),
    writer: '',
  }

  let user
  if (typeof obj === 'string') {
    user = Object.assign(ctx.user, { uuid: obj })
  } else {
    user = obj ? Object.assign(ctx.user, obj) : initValue
  }

  if (USECOOKIE) {
    ctx.setCookie('user', JSON.stringify(user))
  } else {
    localStorage.setItem('user', JSON.stringify(user))
  }

  ctx.store && ctx.store.dispatch(ctx.action.setUuid(ctx.user.uuid))

  return user
}

function getUser() {
  try {
    if (USECOOKIE) {
      return ctx.getCookie('user')
        ? JSON.parse(ctx.getCookie('user'))
        : ctx.setUser()
    }
    return JSON.parse(localStorage.getItem('user')) || ctx.setUser()
  } catch (e) {
    //ctx.logger.verbose(e.message);
    return ctx.setUser()
  }
}

ctx.alert = function ({ message, style, width, onClose }) {
  if (typeof arguments[0] === 'string') {
    ctx.view.AlertDismissable.handleShow({ message: arguments[0] })
  } else {
    ctx.view.AlertDismissable.handleShow({
      message,
      style,
      width,
      onClose,
    })
  }
}

ctx.confirm = function ({ message, style, width, onYes, onNo }) {
  ctx.view.Confirm.handleShow({
    message,
    style,
    width,
    onYes,
    onNo,
  })
}

ctx.user = getUser()
window.ctx = ctx // 개발 중 디버깅을 위해 전역공간으로 노출
