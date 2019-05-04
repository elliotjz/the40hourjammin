import { useContext } from 'react'

import { ScrapeContext } from './ScrapeContext'

export default function Data() {
  const { scrapes } = useContext(ScrapeContext)
  console.log(scrapes);
  return (
    <div>
      <h2>Your Data:</h2>
      {scrapes.donations && (
        <div>
          {scrapes.donations.map((scrape, i) => (
            <p key={i}>{scrape.date}: {scrape.people.length}</p>
          ))}
        </div>
      )}
    </div>
  )
}
