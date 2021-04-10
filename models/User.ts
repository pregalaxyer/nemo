/**
 * @description 
 */
export default interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  /**
   * @description User Status
   */
  userStatus: number
}