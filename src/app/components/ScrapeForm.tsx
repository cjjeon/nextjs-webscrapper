'use client'
import React, {useRef, useState} from 'react';

export default function ScrapeForm() {
    const [markdown, setMarkDown] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)
    const tokenRef = useRef<HTMLInputElement>(null)

    const scrape = async () => {
        if (!inputRef.current) return;
        const url = inputRef.current.value;
        console.log(`url: ${url}`)
        if (!url) return;

        if (!tokenRef.current) return;
        const token = tokenRef.current.value;
        console.log(`token: ${token}`)
        if (!token) return;

        const res = await fetch('/api/scrape', {
            method: 'POST',
            body: JSON.stringify({
                url: inputRef.current.value
            }),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (res.status !== 200) return;
        const data = await res.json()
        setMarkDown(data.markdown)
    }

    return (
        <div>
            <div>
                <div>URL</div>
                <input ref={inputRef}/>

            </div>
            <div>
                <div>
                    Token
                </div>
                <input ref={tokenRef}/>
            </div>
            <div>
                <button onClick={scrape}>
                    Scrape
                </button>
            </div>
            <div>
                {markdown}
            </div>
        </div>
    );
}
