import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  
  console.log('Auth callback - URL:', requestUrl.toString())
  console.log('Auth callback - Code:', code ? 'present' : 'missing')
  console.log('Auth callback - Next:', next)

  if (code) {
    try {
      const supabase = await createClient()
      
      // 尝试使用code交换会话
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Exchange code result:', { data: data ? 'present' : 'null', error })

      if (!error && data?.session) {
        console.log('Authentication successful, redirecting to:', next)
        // 成功登录，重定向到目标页面
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      } else {
        console.error('认证错误:', error)
        console.error('Session data:', data)
        
        // 根据错误类型提供更具体的错误信息
        let errorMessage = 'auth_error=true'
        if (error?.message) {
          errorMessage += `&error_description=${encodeURIComponent(error.message)}`
        }
        
        return NextResponse.redirect(new URL(`/?${errorMessage}`, requestUrl.origin))
      }
    } catch (err) {
      console.error('Exception in auth callback:', err)
      return NextResponse.redirect(new URL('/?auth_error=true&error_description=unexpected_error', requestUrl.origin))
    }
  }

  console.log('No code parameter found, redirecting with error')
  // 出错或无 code 时重定向到首页
  return NextResponse.redirect(new URL('/?auth_error=true&error_description=no_code', requestUrl.origin))
} 