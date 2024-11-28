import { ObjectId } from 'mongodb'
import { INTERACTION_TYPE, REPORT_STATUS, REPORT_TYPE } from '~/enums/util.enum'

interface ReportInteraction {
  _id?: ObjectId
  reporter_id: ObjectId // Người báo cáo
  reported_id: ObjectId // Người bị báo cáo
  report_item_id: ObjectId
  report_type: REPORT_TYPE
  status?: REPORT_STATUS
  content: string[]
  created_at?: Date
  updated_at?: Date
}
export class REPORT_INTERACTION_SCHEMA {
  _id: ObjectId
  reporter_id: ObjectId
  reported_id: ObjectId
  report_item_id: ObjectId
  status: REPORT_STATUS
  report_type: REPORT_TYPE
  content: string[]
  created_at: Date
  updated_at: Date
  constructor(reportInteraction: ReportInteraction) {
    const date = new Date()
    this._id = reportInteraction._id || new ObjectId()
    this.reporter_id = reportInteraction.reporter_id
    this.reported_id = reportInteraction.reported_id
    this.status = reportInteraction.status || REPORT_STATUS.PENDING
    this.report_item_id = reportInteraction.report_item_id
    this.report_type = reportInteraction.report_type
    this.content = reportInteraction.content
    this.created_at = reportInteraction.created_at || date
    this.updated_at = reportInteraction.updated_at || date
  }
}
