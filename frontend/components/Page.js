import { useEffect, useState } from 'react'
import { ScrapeProvider } from './ScrapeContext'

// Custom Hook
function useScrapes() {
  // Initial State inside hook
  const [scrapes, setScrapes] = useState({})

  // Fetch Function
  async function fetchScrapes() {
    console.log("fetching...");
    const res = await fetch('http://localhost:5000/api/data')
    const data = await res.json()
    console.log("done");
    setScrapes(data)
  }

  // Did Mount / did Update
  useEffect(() => {
    fetchScrapes()
  }, [])
  return { scrapes, fetchScrapes }
}

export default function Page({ children }) {
  const hookInfo = useScrapes()
  return (
    <ScrapeProvider value={hookInfo}>
      <div className="page">{children}</div>
    </ScrapeProvider>
  )
}
