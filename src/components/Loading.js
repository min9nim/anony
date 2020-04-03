import React from 'react'

export function Loading(props) {
  return (
    <div>
      <i className="icon-spin3 animate-spin"></i> Loading.. [{props.name}]
    </div>
  )
}
