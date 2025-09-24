import { Suspense } from 'react'
import { LandingPage } from '@/components/landing-page'
import Loading from './loading'

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <LandingPage />
    </Suspense>
  )
}
