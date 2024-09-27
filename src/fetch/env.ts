const domain = document.domain.split('.')[0]
const aiPrefix = {
  xtest: 'https://xrtest.cnki.net',
  xfat: 'https://xfat.cnki.net/psmc',
  192: '/proxy-ai',
  localhost: 'http://localhost:8090',
  x: 'https://gateway.cnki.net/yxrouter/bigmodel'
}[domain] || 'https://x.cnki.net'
const wsAiPrefix = {
  xtest: 'wss://xrtest.cnki.net',
  192: `ws://${window.location.host}/proxy-ai`,
  x: 'wss://gateway.cnki.net/yxrouter/bigmodel'
}[domain] || 'https://x.cnki.net'
export {
  aiPrefix,
  wsAiPrefix
}
