import shortcut from '../ext/shortcut'
export * from './dynamic-import'

export function initializeShortcut(history, context) {
  shortcut.add('Alt+W', () => history.push(context + '/write'))
  shortcut.add('Alt+L', () => history.push(context + '/list'))
  shortcut.add('Alt+E', () => {
    if (location.pathname.includes('post')) {
      // 글보기 화면인 경우에만
      history.push(location.pathname.replace('post', 'edit'))
    }
  })
}
