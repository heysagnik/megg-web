import { NextRequest, NextResponse } from 'next/server'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.megg.megg'
const APP_STORE = 'https://apps.apple.com/in/app/megg/id6761561419'

export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  return NextResponse.redirect(isIOS ? APP_STORE : PLAY_STORE)
}
