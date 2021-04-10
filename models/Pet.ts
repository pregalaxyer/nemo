import Category from './Category'
import Tag from './Tag'
/**
 * @description 
 */
export default interface Pet {
  id: number
  category: Category
  name: string
  photoUrls: Array<string>
  tags: Array<Tag>
  /**
   * @description pet status in the store
   */
  status: 'available' | 'pending' | 'sold'
}