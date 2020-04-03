export function nl2br(str) {
  // 마크다운에서 인용부호 사용시 인용부호 밖으로 벗어날 수 있는 방법이 없어서 아래를 주석처리함

  /*
   * 18.09.05
   * 아래 highlight_nl2br 에서 코드영역에대한 replace 는 제외하도록 코딩이 되어있으므로 개행문자 <br>처리 문장을 다시 주석 해제함
   */
  //return str.replace(/\n\n\n/g, "\n<br><br>\n").replace(/\n\n/g, "\n<br>\n");
  return str
    .replace(/\n\n\n\n/g, '\n<br><br>\n\n')
    .replace(/\n\n\n/g, '\n<br>\n\n')
  //return str;
}

export function highlight_nl2br(str, word) {
  // 마크다운의 코드서식 텍스트에는 검색결과 highlight표시 안하도록 예외 처리
  return str
    .split('```')
    .map((v, i) =>
      i % 2
        ? v
        : v
            .split('`')
            .map((v, i) => (i % 2 ? v : nl2br(tp.highlight(v, word))))
            .join('`'),
    )
    .join('```')
}

export function highlight(str, lang) {
  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed

  if (tp.hljs === undefined) {
    import(/* webpackChunkName: "highlightjs"  */ 'highlight.js')
      .then(m => {
        tp.hljs = m.default
        //this.render();    // 이렇게 한다고 화면이 실제로 다시 그려지지는 않음
        this.setState(this.state)
      })
      .catch(err => console.log(err.message))
    return 'code is loading..'
  }
  if (lang && tp.hljs.getLanguage(lang)) {
    try {
      return tp.hljs.highlight(lang, str).value
    } catch (err) {
      //console.log(err.message);
    }
  }
  try {
    return tp.hljs.highlightAuto(str).value
  } catch (err) {
    //console.log(err.message);
  }
  return '' // use external default escaping
}
