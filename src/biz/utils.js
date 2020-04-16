export function observeDom(dom, callback) {
  dom.observed = true
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }
      callback(entry.target)
      // observer.unobserve(entry.target)
    })
  })
  observer.observe(dom)
  return () => {
    dom.observed = false
    observer.unobserve(dom)
  }
}
