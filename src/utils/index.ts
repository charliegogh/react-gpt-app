interface URLParams {
  [key: string]: string;
}
export const getURLParams = (name?: string): string | URLParams | undefined => {
  const searchPar = new URLSearchParams(window.location.search)
  const paramsObj: URLParams = {}

  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value
  }

  if (name) {
    return paramsObj[name]
  }
  return paramsObj
}
export const copyToClipboard = (str: string, callback: (result: boolean) => void): void => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)

  const selected = document.getSelection()?.rangeCount ? document.getSelection()?.getRangeAt(0) : false
  el.select()
  const result = document.execCommand('copy')
  document.body.removeChild(el)

  if (selected) {
    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(selected)
  }

  callback(result)
}

