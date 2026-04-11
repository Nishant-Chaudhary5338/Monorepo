// ❌ LEGACY JS FILE — no TypeScript, no types, no best practices
// This file is used to demo the code-modernizer / convert-to-typescript tool

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

// No types, plain JS, propTypes instead of interfaces
function LegacyWidget(props) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  // Memory leak: no cleanup on interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData(props.userId)
    }, props.refreshInterval || 5000)
    // ❌ Missing: return () => clearInterval(intervalRef.current)
  }, [])

  // No type annotations, untyped params
  function fetchData(userId) {
    setLoading(true)
    fetch('/api/users/' + userId + '/widget-data')
      .then(function(res) {
        return res.json()
      })
      .then(function(json) {
        setData(json)
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }

  // No accessibility attributes, inline styles, magic numbers
  function renderItem(item, index) {
    return (
      <div
        key={index}
        style={{
          backgroundColor: item.active ? '#4CAF50' : '#f44336',
          padding: '10px',
          margin: '5px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'white'
        }}
        onClick={() => props.onSelect(item)}
      >
        <span>{item.name}</span>
        <span style={{ float: 'right' }}>{item.count}</span>
      </div>
    )
  }

  // Giant render function, should be split into sub-components
  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', maxWidth: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>{props.title}</h2>
        <button
          style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}
          onClick={() => fetchData(props.userId)}
        >
          Refresh
        </button>
      </div>

      {loading && <p style={{ color: '#666' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && data.items && data.items.map(renderItem)}
      {data && data.items && data.items.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center' }}>No items found</p>
      )}

      <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <small style={{ color: '#999' }}>
          Last updated: {data ? new Date(data.lastUpdated).toLocaleString() : 'Never'}
        </small>
      </div>
    </div>
  )
}

// PropTypes instead of TypeScript interfaces
LegacyWidget.propTypes = {
  userId: PropTypes.number.isRequired,
  title: PropTypes.string,
  refreshInterval: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
}

LegacyWidget.defaultProps = {
  title: 'Widget',
  refreshInterval: 5000,
}

export default LegacyWidget
