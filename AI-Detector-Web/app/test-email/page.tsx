'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function EmailTestPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testPasswordReset = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔍 Starting email test...')
      console.log('📧 Email:', email)
      console.log('🌐 Origin:', window.location.origin)
      console.log('🔗 Redirect URL:', `${window.location.origin}/auth/reset-password`)
      
      const startTime = Date.now()
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      const duration = Date.now() - startTime

      setResult({
        success: !error,
        data,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name,
        } : null,
        duration,
        timestamp: new Date().toISOString(),
        config: {
          origin: window.location.origin,
          redirectTo: `${window.location.origin}/auth/reset-password`,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        }
      })

      console.log('📊 Result:', { data, error, duration: `${duration}ms` })
    } catch (err: any) {
      console.error('❌ Unexpected error:', err)
      setResult({
        success: false,
        error: {
          message: err.message,
          stack: err.stack,
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const checkSupabaseConfig = () => {
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      origin: window.location.origin,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    }
    
    console.log('⚙️ Supabase Configuration:', config)
    alert(JSON.stringify(config, null, 2))
  }

  return (
    <div className="min-h-screen p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">Email Test Page</h1>
          <p className="text-foreground/60 mb-6">
            This page helps diagnose email sending issues with Supabase.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Make sure this email is registered in Supabase Authentication
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={testPasswordReset}
                disabled={!email || loading}
              >
                {loading ? 'Testing...' : 'Test Password Reset Email'}
              </Button>
              <Button
                onClick={checkSupabaseConfig}
                variant="outline"
              >
                Check Configuration
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {result.success ? (
                <>
                  <span className="text-2xl">✅</span>
                  <span className="text-green-600 dark:text-green-400">Success!</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">❌</span>
                  <span className="text-red-600 dark:text-red-400">Error</span>
                </>
              )}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Test Details:</h3>
                <div className="bg-foreground/5 rounded-lg p-4 font-mono text-sm space-y-1">
                  <p>⏱️ Duration: {result.duration}ms</p>
                  <p>🕐 Timestamp: {result.timestamp}</p>
                  <p>🌐 Origin: {result.config?.origin}</p>
                  <p>🔗 Redirect: {result.config?.redirectTo}</p>
                </div>
              </div>

              {result.error && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                    Error Details:
                  </h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="font-mono text-sm mb-2">
                      <strong>Message:</strong> {result.error.message}
                    </p>
                    {result.error.status && (
                      <p className="font-mono text-sm mb-2">
                        <strong>Status:</strong> {result.error.status}
                      </p>
                    )}
                    {result.error.name && (
                      <p className="font-mono text-sm">
                        <strong>Name:</strong> {result.error.name}
                      </p>
                    )}
                    
                    {/* Rate Limit Specific Help */}
                    {result.error.status === 429 && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400 text-sm">
                          ⏱️ Rate Limit Hit - Quick Fixes:
                        </h4>
                        <ol className="text-xs space-y-2 list-decimal list-inside">
                          <li>
                            <strong>Quick:</strong> Wait 10-15 minutes and try again
                          </li>
                          <li>
                            <strong>Better:</strong> Set up Gmail SMTP (5 minutes)
                            <br />
                            <span className="ml-4 text-foreground/60">
                              See: <code className="bg-foreground/10 px-1 rounded">/docs/GMAIL_SMTP_SETUP.md</code>
                            </span>
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                    ✅ Email Sent Successfully!
                  </h3>
                  <p className="text-sm">
                    Check the email inbox (and spam folder) for: <strong>{email}</strong>
                  </p>
                  <p className="text-sm mt-2 text-foreground/60">
                    If you don't receive the email within 2-3 minutes, check the troubleshooting guide.
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Full Response:</h3>
                <pre className="bg-foreground/5 rounded-lg p-4 overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="font-semibold mb-2">💡 Next Steps:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Check browser console (F12) for detailed logs</li>
                <li>Go to Supabase Dashboard → Logs → Auth for server-side logs</li>
                <li>Verify Site URL in Supabase Dashboard → Authentication → URL Configuration</li>
                <li>Check redirect URLs are properly configured</li>
                <li>See <code>/docs/EMAIL_TROUBLESHOOTING.md</code> for detailed help</li>
              </ul>
            </div>
          </Card>
        )}

        <Card className="p-6 sm:p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">📋 Troubleshooting Checklist</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Supabase Configuration:</h3>
              <ul className="space-y-1 list-disc list-inside text-foreground/70">
                <li>Site URL set to: <code className="bg-foreground/10 px-1 rounded">http://localhost:3000</code></li>
                <li>Redirect URLs include: <code className="bg-foreground/10 px-1 rounded">http://localhost:3000/**</code></li>
                <li>Email provider is enabled</li>
                <li>SMTP configured (if using custom SMTP)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Common Issues:</h3>
              <ul className="space-y-1 list-disc list-inside text-foreground/70">
                <li><strong>Rate Limit:</strong> Wait 10-15 minutes between attempts</li>
                <li><strong>Email Not Found:</strong> Verify email exists in Supabase → Users</li>
                <li><strong>SMTP Error:</strong> Check credentials and provider settings</li>
                <li><strong>Invalid Redirect:</strong> URL must be in allowed list</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Quick Fixes:</h3>
              <ol className="space-y-1 list-decimal list-inside text-foreground/70">
                <li>Set Site URL to <code className="bg-foreground/10 px-1 rounded">http://localhost:3000</code></li>
                <li>Add wildcard redirect: <code className="bg-foreground/10 px-1 rounded">http://localhost:3000/**</code></li>
                <li>Use Gmail SMTP with App Password (see docs)</li>
                <li>Check Supabase status: <a href="https://status.supabase.com" target="_blank" className="text-blue-600 dark:text-blue-400 underline">status.supabase.com</a></li>
              </ol>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/60">
            For detailed troubleshooting, see: <code>/docs/EMAIL_TROUBLESHOOTING.md</code>
          </p>
        </div>
      </div>
    </div>
  )
}
