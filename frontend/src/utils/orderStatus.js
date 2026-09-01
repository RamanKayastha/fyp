export const FULFILLMENT_STATUSES = [
  'PENDING',
  'PACKING',
  'READY_TO_SHIP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export const ORDER_STATUSES = [...FULFILLMENT_STATUSES, 'CANCELLED']

export const isTerminalStatus = (status) =>
  status === 'DELIVERED' || status === 'CANCELLED'

export const statusOptionsFor = (current) => {
  if (isTerminalStatus(current)) return [current]

  const index = FULFILLMENT_STATUSES.indexOf(current)
  const next = index >= 0 ? FULFILLMENT_STATUSES[index + 1] : FULFILLMENT_STATUSES[0]
  return [current, next, 'CANCELLED'].filter(Boolean)
}
