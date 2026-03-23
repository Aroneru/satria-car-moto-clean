// app/page.tsx
import { Navigation } from '@/components/sections/Navigation'
import { Home } from '@/components/sections/Home'
import { Services } from '@/components/sections/Services'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main>
        <HomeSection />
        <Services />
        <About />
        <Contact />
      </main>
    </>
  )
}