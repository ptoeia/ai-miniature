import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') || '/'
  
  // 检查是否有认证错误参数
  const authError = requestUrl.searchParams.get('auth_error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('Auth confirm - URL:', requestUrl.toString())
  console.log('Auth confirm - Token hash:', token_hash ? 'present' : 'missing')
  console.log('Auth confirm - Type:', type)
  console.log('Auth confirm - Next:', next)
  console.log('Auth confirm - Auth error:', authError)
  console.log('Auth confirm - Error description:', errorDescription)

  // 如果有认证错误，返回一个页面来处理客户端参数
  if (authError === 'true') {
    console.log('Auth error detected, returning client page to handle fragments')
    // 返回一个页面来处理URL fragment中的参数
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Processing Authentication...</title>
        <script>
          // 检查URL fragment中是否有access_token
          const fragment = window.location.hash.substring(1);
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          const errorDescription = params.get('error_description');
          
          if (accessToken) {
            // 如果有access_token，说明认证成功，重定向到首页
            console.log('Access token found in fragment, authentication successful');
            window.location.href = '/';
          } else if (errorDescription) {
            // 如果有错误描述，重定向到错误页面
            console.log('Error in fragment:', errorDescription);
            window.location.href = '/?auth_error=true&error_description=' + encodeURIComponent(errorDescription);
          } else {
            // 其他情况，重定向到错误页面
            window.location.href = '/?auth_error=true&error_description=unknown_error';
          }
        </script>
      </head>
      <body>
        <p>Processing authentication...</p>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }

  // Handle email confirmation with token_hash + type - 官方推荐方式
  if (token_hash && type) {
    try {
      const supabase = await createClient()
      
      console.log('Processing email verification with token_hash and type')
      
      // Use verifyOtp for email confirmation - 官方文档方式
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      
      console.log('Email verification result:', { error })

      if (!error) {
        console.log('Email verification successful, redirecting to:', next)
        // redirect user to specified redirect URL or root of app
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      } else {
        console.error('邮件验证错误:', error)
        
        let errorMessage = 'auth_error=true&error_type=email_verification'
        if (error?.message) {
          errorMessage += `&error_description=${encodeURIComponent(error.message)}`
        }
        
        return NextResponse.redirect(new URL(`/?${errorMessage}`, requestUrl.origin))
      }
    } catch (err) {
      console.error('Exception in email verification:', err)
      return NextResponse.redirect(new URL('/?auth_error=true&error_description=email_verification_failed', requestUrl.origin))
    }
  }

  console.log('No valid parameters found, redirecting with error')
  // redirect the user to an error page with some instructions
  return NextResponse.redirect(new URL('/?auth_error=true&error_description=missing_parameters', requestUrl.origin))
} 