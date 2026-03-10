export async function mockPayment(amount: number): Promise<{ paymentId: string; status: 'success' }> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return { paymentId: `pay_${Date.now()}`, status: 'success' }
}
