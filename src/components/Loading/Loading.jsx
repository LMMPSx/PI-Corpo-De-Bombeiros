// components/Loading/Loading.jsx
import React from 'react'
import { useConfig } from '../../contexts/ConfigContext'
import './Loading.css'

function Loading() {
  const { loading } = useConfig()

  if (!loading) {
    return null
  }

  return (
    <div className="global-loading-overlay" aria-live="polite" aria-busy="true">
      <div className="global-loading-container">
        <div className="global-loading-spinner"></div>
        <div className="global-loading-text">Carregando configurações...</div>
      </div>
    </div>
  )
}

export default Loading