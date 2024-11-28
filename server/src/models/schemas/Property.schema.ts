import { ObjectId } from 'mongodb'

interface PropertyType {
  _id?: ObjectId
  name: string
  description: string
  created_at?: Date
  updated_at?: Date
}
export class PROPERTY_SCHEMA {
  _id: ObjectId
  name: string
  description: string
  created_at: Date
  updated_at: Date
  constructor(data: PropertyType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.name = data.name
    this.description = data.description
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
