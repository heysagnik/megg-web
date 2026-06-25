'use client'

import { useEffect } from 'react'

export default function InstagramAppRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
    
    const isInstagram = /Instagram/i.test(userAgent)
    const isAndroid = /Android/i.test(userAgent)

    if (isInstagram && isAndroid) {
      const redirectKey = 'instagram_intent_redirected'
      
      // Prevent infinite redirect loops if the intent falls back to the webview
      if (!sessionStorage.getItem(redirectKey)) {
        sessionStorage.setItem(redirectKey, 'true')
        
        const currentUrl = window.location.href
        const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, '')
        
        // Android Intent URI to force Instagram's webview to open the native app
        const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.megg.megg;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`
        
        window.location.replace(intentUrl)
      }
    }
  }, [])

  return null
}
