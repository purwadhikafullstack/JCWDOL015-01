import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { is } from 'cypress/types/bluebird'
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isAdmin = request.cookies.get('isAdmin')
  
  if (request.nextUrl.pathname.startsWith('/dashboard')) {

    console.log(token, isAdmin)

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if(isAdmin?.value === 'false') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/jobs/apply') || request.nextUrl.pathname.startsWith('/preselection-test')) {
    console.log(token, isAdmin)
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if(isAdmin?.value === 'true') {
      console.log(typeof(isAdmin?.value));
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}