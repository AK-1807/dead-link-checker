// app/providers.js
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export default function PHProvider({ children }) {
  useEffect(() => {
    posthog.init('<ph_project_api_key>', {
      api_host: 'https://us.i.posthog.com',
    })
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}