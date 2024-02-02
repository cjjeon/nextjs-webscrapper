'use client'
import React, {useRef} from 'react';

export default function ScrapeForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const scrape = async () => {
    if (!inputRef.current) return;

    const res = await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({
        url: inputRef.current.value
      })
    })

    const data = await res.json()

    console.log(data)
  }

  return (
    <div>
      <input ref={inputRef}/>
      <button onClick={scrape}>
        Scrape
      </button>
    </div>
  );
}
