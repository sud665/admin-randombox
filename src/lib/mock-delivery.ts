export interface TrackingStep {
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED'
  label: string
  time: string | null
  done: boolean
}

export interface TrackingInfo {
  carrier: string
  trackingNo: string
  steps: TrackingStep[]
}

const trackingDatabase: Record<string, TrackingInfo> = {
  'SHIPPING': {
    carrier: 'CJ대한통운',
    trackingNo: '',
    steps: [
      { status: 'PENDING', label: '접수', time: '2026-03-06 14:30', done: true },
      { status: 'PICKED_UP', label: '수거', time: '2026-03-06 18:00', done: true },
      { status: 'IN_TRANSIT', label: '이동중', time: '2026-03-07 09:00', done: true },
      { status: 'DELIVERED', label: '배달완료', time: null, done: false },
    ],
  },
  'DELIVERED': {
    carrier: 'CJ대한통운',
    trackingNo: '',
    steps: [
      { status: 'PENDING', label: '접수', time: '2026-02-08 10:00', done: true },
      { status: 'PICKED_UP', label: '수거', time: '2026-02-08 15:30', done: true },
      { status: 'IN_TRANSIT', label: '이동중', time: '2026-02-09 08:00', done: true },
      { status: 'DELIVERED', label: '배달완료', time: '2026-02-10 14:20', done: true },
    ],
  },
}

export function getMockTrackingInfo(trackingNo: string, orderStatus?: string): TrackingInfo {
  const template = trackingDatabase[orderStatus === 'DELIVERED' ? 'DELIVERED' : 'SHIPPING']
  return {
    ...template,
    trackingNo,
  }
}

export function generateTrackingNo(orderId: string): string {
  const hash = orderId.replace(/[^0-9]/g, '').padStart(12, '0')
  return `6${hash.slice(0, 11)}`
}
