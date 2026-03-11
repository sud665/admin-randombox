import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useMock = isMockMode()

    if (useMock) {
      return jsonResponse({
        deliveryId: id,
        trackingNo: 'TRACK-2026-001234',
        carrier: 'CJ대한통운',
        status: 'IN_TRANSIT',
        events: [
          { time: '2026-03-08T09:00:00.000Z', location: '서울 강남구 집하점', description: '상품 접수' },
          { time: '2026-03-08T14:00:00.000Z', location: '서울 송파 Hub', description: '배송 출발' },
          { time: '2026-03-09T08:00:00.000Z', location: '대전 Hub', description: '간선 상차' },
          { time: '2026-03-09T15:00:00.000Z', location: '부산 해운대구 배송점', description: '배송 중' },
        ],
      })
    }

    // TODO: External tracking API call
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
