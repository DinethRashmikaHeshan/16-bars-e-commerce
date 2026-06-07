export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

export const parseCurrency = (input: string): number => {
  const cleaned = input.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}
