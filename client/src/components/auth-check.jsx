"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminLoggedIn, isStudentLoggedIn } from '@/utils/auth'

/**
 * Component that checks authentication state and redirects based on configuration
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render
 * @param {boolean} props.requireAuth If true, redirects to login when not authenticated
 * @param {boolean} props.adminOnly If true, redirects non-admin users
 * @param {boolean} props.studentOnly If true, redirects non-student users
 * @param {boolean} props.loginPage If true, redirects logged-in users to their dashboard
 * @param {string} props.redirectTo Custom redirect path
 * @returns {React.ReactNode}
 */
export default function AuthCheck({ 
  children, 
  requireAuth = false,
  adminOnly = false,
  studentOnly = false,
  loginPage = false,
  redirectTo = ''
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Get auth status
    const adminAuth = isAdminLoggedIn()
    const studentAuth = isStudentLoggedIn()
    const isAuthenticated = adminAuth || studentAuth
    
    // Handle login/signup pages (redirect away if already logged in)
    if (loginPage && isAuthenticated) {
      if (adminAuth) {
        router.push(redirectTo || '/admin')
        return
      }
      if (studentAuth) {
        router.push(redirectTo || '/profile')
        return
      }
    }
    
    // Handle protected pages (redirect to login if not authenticated)
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/login')
      return
    }
    
    // Handle role-specific pages
    if (adminOnly && !adminAuth) {
      if (studentAuth) {
        router.push('/profile') // Student trying to access admin page
      } else {
        router.push('/admin/login') // Not logged in, go to admin login
      }
      return
    }
    
    if (studentOnly && !studentAuth) {
      if (adminAuth) {
        router.push('/admin') // Admin trying to access student page
      } else {
        router.push('/login') // Not logged in, go to student login
      }
      return
    }
    
    setLoading(false)
  }, [router, requireAuth, adminOnly, studentOnly, loginPage, redirectTo])
  
  // Show nothing during check to prevent content flash
  if (loading) {
    return null
  }
  
  return <>{children}</>
} 