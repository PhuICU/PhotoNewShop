import { ImageTypes } from '~/type'

export interface NEWS_REQUEST_BODY {
  title: string
  description: string
  content: {
    sub_title: string
    sub_content: string
    images: ImageTypes[]
  }[]
}
