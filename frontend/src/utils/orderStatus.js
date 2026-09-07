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

/** Cancel allowed before out for delivery. */
export const canCancelOrder = (status) =>
  status === 'PENDING' || status === 'PACKING' || status === 'READY_TO_SHIP'

export const esewaRefundPercentFor = (status) => {
  if (status === 'PENDING') return 100
  if (status === 'PACKING' || status === 'READY_TO_SHIP') return 70
  return null
}

export const statusOptionsFor = (current) => {
  if (isTerminalStatus(current)) return [current]

  const index = FULFILLMENT_STATUSES.indexOf(current)
  const next = index >= 0 ? FULFILLMENT_STATUSES[index + 1] : FULFILLMENT_STATUSES[0]
  const options = [current, next].filter(Boolean)
  if (canCancelOrder(current)) options.push('CANCELLED')
  return options
}
