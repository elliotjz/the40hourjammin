import { useContext } from 'react'

import { ScrapeContext } from './ScrapeContext'
import DonationChart from './DonationChart';

export default function Data() {
  const { scrapes } = useContext(ScrapeContext)
  const donationData = scrapes ? scrapes.donations : null
  return (
    <div>
      {donationData ?
        <DonationChart donationData={donationData} /> :
        <p>Loading...</p>}
    </div>
  )
}
