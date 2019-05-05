import { useContext } from 'react'

import { ScrapeContext } from './ScrapeContext'
import DonationChart from './DonationChart';

export default function Data() {
  const { scrapes, fetchScrapes } = useContext(ScrapeContext)
  const donationData = scrapes ? scrapes.donations : null
  const names = scrapes ? scrapes.names : null

  return (
    <div>
      {donationData ?
        <DonationChart donationData={donationData} names={names} /> :
        <p>Loading...</p>
      }
      <button type="button" onClick={fetchScrapes}>Refresh Data</button>
    </div>
  )
}
