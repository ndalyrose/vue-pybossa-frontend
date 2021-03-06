/**
 * Strip a script from a block of text, append to body and execute.
 *
 * This is used to get around the fact that v-html updates innerHTML, which
 * does not allow the execution of scripts.
 */
export default function (text) {
  let scripts = ''
  const pattern = /<script[^>]*>([\s\S]*?)<\/script>/gi
  text.replace(pattern, function () {
    scripts += arguments[1] + '\n'
    return ''
  })
  let body = document.getElementsByTagName('head')[0]
  let scriptNode = document.createElement('script')
  scriptNode.setAttribute('type', 'text/javascript')
  scriptNode.innerHTML = scripts
  body.appendChild(scriptNode)
}
