import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OutPolicy from '../components/OutPolicy'
import NewsletterBox from '../components/NewsletterBox'
const home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OutPolicy />
      <NewsletterBox />
    </div>
  )
}

export default home