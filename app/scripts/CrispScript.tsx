import { useEffect } from 'react'

export function CrispScript() {
  useEffect(() => {
    ;(window as any).$crisp = [['safe', true]]
    ;(window as any).CRISP_WEBSITE_ID = '3fbfa45d-3642-49fd-8fe8-4f11ae3539bb'

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    script.defer = true
    document.getElementsByTagName('head')[0].appendChild(script)
  }, [])

  return null
}
