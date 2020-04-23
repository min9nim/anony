import React from 'react'

export function Loading({ name }) {
  return (
    <div>
      <i className="icon-spin3 animate-spin"></i> Loading.. [{name}]
    </div>
  )
}
