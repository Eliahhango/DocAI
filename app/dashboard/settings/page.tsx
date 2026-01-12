'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, User, CreditCard, Check, X } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<'FREE' | 'PREMIUM'>('FREE')

  useEffect(() => {
    // Check for success/cancel from Stripe
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated successfully!')
      setSubscription('PREMIUM')
      router.replace('/dashboard/settings')
    } else if (searchParams.get('canceled') === 'true') {
      toast.error('Subscription canceled')
      router.replace('/dashboard/settings')
    }
  }, [searchParams, router])

  const handleSubscribe = async (period: 'monthly' | 'yearly') => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to create checkout session')
        return
      }

      const stripe = await stripePromise
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to open customer portal')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold">
            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              defaultValue={session?.user?.name || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">Profile editing coming soon</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue={session?.user?.email || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Subscription</h2>
        </div>

        {subscription === 'FREE' ? (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Free Plan</div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Limited document generation
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Upgrade to Premium</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="font-bold text-2xl mb-1">$9.99</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">per month</div>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Unlimited document generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Advanced templates
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Faster AI processing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Priority support
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe('monthly')}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe Monthly'}
                  </Button>
                </div>

                <div className="border-2 border-primary rounded-lg p-6 relative">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
                    Best Value
                  </div>
                  <div className="font-bold text-2xl mb-1">$99.99</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">per year</div>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Unlimited document generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Advanced templates
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Faster AI processing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Save 17%
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe('yearly')}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe Yearly'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-green-800 dark:text-green-200">Premium Plan</div>
                <span className="text-sm text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                You have access to all premium features
              </div>
            </div>
            <Button onClick={handleManageSubscription} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Manage Subscription
            </Button>
          </div>
        )}
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          API keys and advanced configuration options will be available in a future update.
        </div>
      </div>
    </div>
  )
}
