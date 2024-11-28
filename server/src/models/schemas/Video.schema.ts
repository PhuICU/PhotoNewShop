import { ObjectId } from 'mongodb'

interface VideoType {
  _id?: ObjectId
  public_id: string
  video_url: string
  created_at?: Date
  updated_at?: Date
}
export class VIDEO_SCHEMA {
  _id: ObjectId
  public_id: string
  video_url: string
  created_at?: Date
  updated_at?: Date
  constructor(data: VideoType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.public_id = data.public_id
    this.video_url = data.video_url
    this.created_at = date
    this.updated_at = date
  }
}
