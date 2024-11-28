import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ROLE_TYPE } from '~/enums/user.enum'
import { COMMENT_REQUEST_BODY } from '~/models/requests/comments.quest'
import commentsService from '~/services/comments.service'
import vipPackagesService from '~/services/vip_packages.service'
import vipUserDetailsService from '~/services/vip_user_detail.service'
import { TokenPayload } from '~/type'
import { responseError, responseSuccess } from '~/utils/response'
const createComment = async (req: Request<ParamsDictionary, any, COMMENT_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const vip_detail = await vipUserDetailsService.getVipUserByUserId(user_id)
  if (!vip_detail) {
    throw new Error('Bạn không có quyền thêm comment!')
  }
  const vip_package = await vipPackagesService.getById(vip_detail.package_id.toString())
  if (!vip_package) {
    return responseError(res, {
      message: 'Gói vip không tồn tại',
      code: 400 // Bad request
    })
  }
  let comments_used = vip_detail.comments_used
  if (vip_package.priviLeges.commentPrivileges.commentLimit === 'unlimited') {
    comments_used += 1
  } else if (comments_used >= Number(vip_package.priviLeges.commentPrivileges.commentLimit)) {
    return responseError(res, {
      message: 'Bạn đã hết lượt comment',
      code: 400 // Bad request
    })
  }
  const result = await commentsService.createComment(payload)
  return responseSuccess(res, {
    message: 'Tạo comment thành công',
    data: result
  })
}
const getComments = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await commentsService.getAllComments()
  return responseSuccess(res, {
    message: 'Lấy danh sách bình luận thành công',
    data: result
  })
}
const getCommentsOfPostId = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { postId } = req.params
  const result = await commentsService.getCommentsByPostId(postId)
  return responseSuccess(res, {
    message: 'Lấy danh sách bình luận thành công',
    data: result
  })
}
const updateComment = async (req: Request<ParamsDictionary, any, COMMENT_REQUEST_BODY, any>, res: Response) => {
  const { commentId } = req.params
  const { user_id, role } = req.decoded_access_token as TokenPayload
  const payload = req.body
  if (role === ROLE_TYPE.ADMIN) {
    const result = await commentsService.adminUpdateComment(commentId, payload)
    return responseSuccess(res, {
      message: 'Admin cập nhật comment thành công',
      data: result
    })
  }
  const result = await commentsService.updateComment(user_id, commentId, payload)
  if (!result) {
    return responseError(res, {
      message: 'Cập nhật comment thất bại hoặc bạn không có quyền cập nhật',
      code: 400 // Bad request
    })
  }
  return responseSuccess(res, {
    message: 'Cập nhật comment thành công',
    data: result
  })
}
const deleteComment = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  const { user_id, role } = req.decoded_access_token as TokenPayload
  if (role === ROLE_TYPE.ADMIN) {
    const result = await commentsService.adminDeleteComment(id)
    return responseSuccess(res, {
      message: 'Admin xóa comment thành công',
      data: result
    })
  }
  const result = await commentsService.deleteComment(id, user_id)
  if (!result) {
    return responseError(res, {
      message: 'Comment không tồn tại hoặc bạn không có quyền xóa',
      code: 400 // Bad request
    })
  }
  return responseSuccess(res, {
    message: 'Xóa comment thành công',
    data: result
  })
}
const deleteAllCommentsOfPostID = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { postId } = req.params
  const result = await commentsService.deleteAllCommentsOfPostId(postId)
  return responseSuccess(res, {
    message: 'Xóa tất cả comment của bài viết thành công',
    data: result
  })
}
const commentsControllers = {
  createComment,
  getComments,
  getCommentsOfPostId,
  updateComment,
  deleteComment,
  deleteAllCommentsOfPostID
}
export default commentsControllers
