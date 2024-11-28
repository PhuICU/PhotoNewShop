import { ObjectId } from 'mongodb'
import { ImageTypes } from '~/type'

interface NewsType {
  _id?: ObjectId
  title: string
  description: string
  content: {
    sub_title: string
    sub_content: string
    images: ImageTypes[]
  }[]
  view?: number
  // Đăng bởi
  posted_by: ObjectId
  // Ngày đăng tin
  created_at?: Date
  // Ngày cập nhật
  updated_at?: Date
}
export class NEWS_SCHEMA {
  _id: ObjectId
  title: string
  description: string
  content: {
    sub_title: string
    sub_content: string
    images: ImageTypes[]
  }[]
  view: number
  posted_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(data: NewsType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.title = data.title
    this.description = data.description
    this.content = data.content
    this.view = data.view || 0
    this.posted_by = data.posted_by
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
