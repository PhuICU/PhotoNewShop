import { INTERACTION_TYPE, REPORT_TYPE } from '~/enums/util.enum'

export type REPORTS_INTERACTION_REQUEST_BODY = {
  reported_id: string
  report_item_id: string
  report_type: REPORT_TYPE
  content: string[]
}
