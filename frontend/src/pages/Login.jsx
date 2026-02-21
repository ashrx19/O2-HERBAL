import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const navigate = useNavigate()
  const { handleLoginSuccess } = useAuth()
  const [step, setStep] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [demoOtp, setDemoOtp] = useState('')

  const API_BASE = 'http://localhost:5000/api'

  // Login with email & password
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        handleLoginSuccess(data.token, data.user)
        setMessage('✅ Login successful! Redirecting...')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Connection error. Is backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  // Send OTP for signup
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`${API_BASE}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email }),
      })

      const data = await res.json()

      if (data.success) {
        setOtpSent(true)
        setDemoOtp(data.demoOTP || '')
        setMessage(`✅ OTP sent to ${email} (Check console or see below)`)
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Connection error. Is backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP and create account
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`${API_BASE}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          otp,
          name,
          password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        handleLoginSuccess(data.token, data.user)
        setMessage('✅ Account created & logged in! Redirecting...')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setError(data.message || 'OTP verification failed')
      }
    } catch (err) {
      setError('Connection error. Is backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full">
          <h1 className="heading-font text-3xl text-[var(--color-primary)] mb-8 text-center">
            {step === 'login' ? 'Login' : 'Sign Up'}
          </h1>

          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* LOGIN FORM */}
          {step === 'login' && !otpSent && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('signup')
                  setEmail('')
                  setPassword('')
                  setName('')
                  setOtp('')
                  setOtpSent(false)
                  setError('')
                  setMessage('')
                }}
                className="w-full py-2 rounded-lg font-semibold text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                Sign Up with OTP
              </button>
            </form>
          )}

          {/* SIGNUP - STEP 1: SEND OTP */}
          {step === 'signup' && !otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login')
                  setEmail('')
                  setPassword('')
                  setName('')
                  setError('')
                  setMessage('')
                }}
                className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* SIGNUP - STEP 2: VERIFY OTP */}
          {step === 'signup' && otpSent && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  📌 <strong>Demo OTP:</strong> {demoOtp || 'Check browser console'}
                </p>
                <p className="text-xs text-blue-700">
                  In production, OTP would be sent via email/SMS. For testing, use the OTP shown above.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP (6 digits)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                  loading || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError('')
                  setMessage('')
                }}
                className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-800"
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {step === 'login' ? (
              <>
                New customer?{' '}
                <button
                  onClick={() => {
                    setStep('signup')
                    setEmail('')
                    setPassword('')
                    setName('')
                    setOtp('')
                    setOtpSent(false)
                    setError('')
                    setMessage('')
                  }}
                  className="text-[var(--color-primary)] hover:underline font-semibold"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setStep('login')
                    setEmail('')
                    setPassword('')
                    setName('')
                    setError('')
                    setMessage('')
                  }}
                  className="text-[var(--color-primary)] hover:underline font-semibold"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Continue as Guest */}
          <Link
            to="/"
            className="block mt-6 text-center text-sm text-gray-500 hover:text-gray-700 border-t pt-6"
          >
            Continue as Guest →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
