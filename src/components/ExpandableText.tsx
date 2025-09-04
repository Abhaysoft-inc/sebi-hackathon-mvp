"use client"
import { useState } from 'react'

export default function ExpandableText({ summary, full }: { summary: string; full: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="text-sm leading-relaxed">
      <p>{open ? full : summary}</p>
      <button onClick={() => setOpen(o => !o)} className="mt-2 text-blue-400 hover:underline text-xs font-medium">
        {open ? 'Show less' : 'Read full opinion'}
      </button>
    </div>
  )
}