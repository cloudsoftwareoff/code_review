import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get session from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error in auth callback:', error)
          throw error
        }
        
        // Check if we have a session
        if (data?.session) {
          console.log('Successfully authenticated')
          // Redirect to home page
          navigate('/', { replace: true })
        } else {
          console.error('No session found in callback')
          navigate('/login?error=no_session', { replace: true })
        }
      } catch (err) {
        console.error('Authentication error:', err)
        navigate('/login?error=auth_error', { replace: true })
      }
    }
    
    handleAuthCallback()
  }, [navigate])

  return (
    <div className="loading-container full-page">
      <div className="loader"></div>
      <p>Completing authentication...</p>
    </div>
  )
}