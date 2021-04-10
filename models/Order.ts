/**
 * @description 
 */
export default interface Order {
  id: number
  petId: number
  quantity: number
  shipDate: string
  /**
   * @description Order Status
   */
  status: 'placed' | 'approved' | 'delivered'
  complete: boolean
}