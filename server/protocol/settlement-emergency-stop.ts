let emergencyStopped = false

export function setSettlementEmergencyStop(value: boolean) {
  emergencyStopped = value
}

export function isSettlementEmergencyStopped() {
  return emergencyStopped
}
