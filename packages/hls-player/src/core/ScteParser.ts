import type { Scte35Marker } from '../types/index.js'

// Minimal SCTE-35 splice command types we care about
const SPLICE_INSERT = 0x05
const TIME_SIGNAL = 0x06

function readUint32(buf: Uint8Array, offset: number): number {
  return (
    ((buf[offset]! << 24) | (buf[offset + 1]! << 16) | (buf[offset + 2]! << 8) | buf[offset + 3]!) >>> 0
  )
}

function parseBase64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function parseScte35(base64OrHex: string): Scte35Marker | null {
  try {
    const isHex = /^[0-9a-fA-F]+$/.test(base64OrHex) && base64OrHex.length % 2 === 0
    let bytes: Uint8Array

    if (isHex) {
      bytes = new Uint8Array(base64OrHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)))
    } else {
      bytes = parseBase64ToBytes(base64OrHex)
    }

    // SCTE-35 splice_info_section starts at byte 0
    // table_id = 0xFC
    if (bytes[0] !== 0xfc) return null

    const spliceCommandType = bytes[13]
    const ptsOffset = readUint32(bytes, 14) / 90000 // 90kHz clock

    if (spliceCommandType === SPLICE_INSERT) {
      // splice_event_cancel_indicator at bit 7 of byte after splice_event_id (4 bytes)
      const cancelFlag = (bytes[18]! >> 7) & 1
      if (cancelFlag) return null
      const outOfNetworkFlag = (bytes[19]! >> 7) & 1
      return {
        type: outOfNetworkFlag ? 'CUE_OUT' : 'CUE_IN',
        time: ptsOffset,
        rawBase64: base64OrHex,
      }
    }

    if (spliceCommandType === TIME_SIGNAL) {
      // Segmentation descriptor determines CUE_OUT vs CUE_IN
      // Simplified: just return CUE_OUT as time signal without deeper parsing
      return {
        type: 'CUE_OUT',
        time: ptsOffset,
        rawBase64: base64OrHex,
      }
    }

    return null
  } catch {
    return null
  }
}

export function extractScte35FromId3(frames: { key: string; data: string | Uint8Array }[]): Scte35Marker | null {
  for (const frame of frames) {
    if (frame.key === 'TXXX' || frame.key === 'PRIV') {
      const raw = typeof frame.data === 'string' ? frame.data : String.fromCharCode(...frame.data)
      if (raw.length > 0) {
        const marker = parseScte35(btoa(raw))
        if (marker) return marker
      }
    }
  }
  return null
}
