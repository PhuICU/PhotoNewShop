import { VIP_STATUS } from '~/enums/util.enum'

export interface VIP_USER_DETAIL_REQUEST_BODY {
  user_id: string
  package_id: string
  start_date: Date
  end_date: Date
  status?: VIP_STATUS
  posting_used?: number
  comments_used?: number
  featured_posts_used?: number
}
