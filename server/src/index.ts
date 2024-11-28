import express, { type Request, type Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import cron from 'node-cron'
import env_config from '~/configs/env.config'
import databaseService from './services/database.service'
import userRoutes from './routes/users.routes'
import { defaultErrorHandler } from './utils/requestHandler'
import propertiesRoutes from './routes/properties.routes'
import photoNewsRoutes from './routes/photo_news.routes'
import commentsRoutes from './routes/comments.routes'
import uploadImagesRoutes from './routes/upload_images.routes'
import favoritesRoutes from './routes/favorites.routes'
import reportsInteractionRoutes from './routes/reports_interaction.routes'
import photoNewsService from './services/photo_news.service'
import { calculateRaw, normalize } from './utils/caculateRating'
import newsRoutes from './routes/news.routes'
import vipPackagesRoutes from './routes/vip_packages.routes'
import paymentsRoutes from './routes/payments.routes'
import paypalService from './paypal_api'
import videoRoutes from './routes/video.routes'
import vipUserDetailsRoutes from './routes/vip_user_details.routes'
import chatRouter from './routes/chat.routes'
import messageRouter from './routes/messages.routes'
import { POST_STATUS, VIP_STATUS } from './enums/util.enum'
import fetch from 'node-fetch'
import { responseSuccess } from './utils/response'
import { sendEmailWarningVipExpire } from './utils/email'
const app = express()
app.use(
  cors({
    origin: [(env_config.CLIENT_PORTS as string) || 'http://localhost:5173', 'http://127.0.0.1:5500'],
    credentials: true,
    optionsSuccessStatus: 200
  })
)
app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.get('/upload-image-example', (req, res) => {
  res.render('uploadImage')
})
app.get('', (req, res) => {
  return res.render('upLoadVideo')
})
app.get('/checkout', (req, res) => {
  return res.render('checkout')
})
app.get('/api/province', async (req, res) => {
  const result = await fetch('https://vapi.vnappmob.com/api/province/')
  return responseSuccess(res, {
    message: 'Lấy province thành công',
    data: await result.json()
  })
})
app.get('/api/district/:id', async (req, res) => {
  const { id } = req.params
  const result = await fetch(`https://vapi.vnappmob.com/api/province/district/${id}`)
  return responseSuccess(res, {
    message: 'Lấy district thành công',
    data: await result.json()
  })
})
// Connect to the database
databaseService.connect()
app.use('/photo-news', photoNewsRoutes)
// Update rating for all posts every day at 00:00 AM
cron.schedule('0 0 * * *', async () => {
  try {
    const posts = await photoNewsService.getAllNotPagination()
    const rawRating = posts.map((post) => calculateRaw(post.view, post.published_at))
    const maxRating = Math.max(...rawRating)
    const minRating = Math.min(...rawRating)
    for (const post of posts) {
      const rating = calculateRaw(post.view, post.published_at)
      const normalizedRating = normalize(rating, maxRating, minRating)
      await photoNewsService.updateRating(post._id.toString(), Math.round(normalizedRating * 10) / 10)
    }
    console.log('Update rating success')
  } catch (error) {
    console.log(error)
  }
})
cron.schedule('*/5 * * * *', async () => {
  try {
    // Fetch top trending news
    const topTrending = await photoNewsService.getTopNews({})
    if (!topTrending) {
      return
    }

    // Find all posts with vip.is_top = true, status = POST_STATUS.CONFIRMED, and is_priority = false
    const topNews = await databaseService.photo_news
      .find({
        'vip.is_top': true,
        status: POST_STATUS.CONFIRMED,
        is_priority: false
      })
      .sort({ 'vip.trendPosition': 1 })
      .toArray()

    if (topNews.length === 0) {
      return
    }

    // Update the vip.trendPosition and is_priority of the top news posts
    for (let i = 0; i < topNews.length; i++) {
      await databaseService.photo_news.findOneAndUpdate(
        { _id: topNews[i]._id },
        {
          $set: {
            is_priority: i === 0,
            'vip.trendPosition': i
          }
        }
      )
    }

    // Update the top trending post
    await databaseService.photo_news.findOneAndUpdate(
      { _id: topTrending._id },
      {
        $set: {
          is_priority: false,
          'vip.trendPosition': topNews.length
        }
      }
    )

    console.log('Cập nhật tin đăng xu hướng...')
  } catch (error) {
    console.error('Failed to update trending posts', error)
  }
})
// Update post status if expired every day at 00:00 AM
cron.schedule('0 0 * * *', async () => {
  try {
    const posts = await photoNewsService.getAllNotPagination()
    for (const post of posts) {
      const now = new Date()
      if (now > post.expired_at) {
        await photoNewsService.updateStatus(post._id.toString(), POST_STATUS.EXPIRED)
      }
    }
    console.log('Cập nhật trạng thái tin đăng')
  } catch (error) {
    console.log(error)
  }
})
// Cập nhật trạng thái vip tự động sau mỗi ngày 00:00 AM
cron.schedule('*/1 * * * *', async () => {
  try {
    const vipUsers = await databaseService.vip_user_details.find().toArray()
    const now = new Date()
    const nowDateOnly = new Date(now.toDateString()) // Chỉ lấy phần ngày, bỏ qua phần thời gian

    for (const vipUser of vipUsers) {
      const endDate = new Date(vipUser.end_date)
      const startDate = new Date(vipUser.start_date)
      const endDateOnly = new Date(endDate.toDateString()) // Chỉ lấy phần ngày, bỏ qua phần thời gian
      const startDateOnly = new Date(startDate.toDateString()) // Chỉ lấy phần ngày, bỏ qua phần thời gian

      // Nếu hết hạn thì cập nhật trạng thái vip
      if (now > endDate) {
        await databaseService.vip_user_details.findOneAndUpdate(
          {
            _id: vipUser._id
          },
          {
            $set: {
              current_active: false,
              status: VIP_STATUS.EXPIRED
            }
          }
        )
      }

      // Nếu bắt đầu vip thì cập nhật trạng thái vip
      if (nowDateOnly.getTime() === startDateOnly.getTime()) {
        await databaseService.vip_user_details.findOneAndUpdate(
          {
            _id: vipUser._id
          },
          {
            $set: {
              current_active: true,
              status: VIP_STATUS.ACTIVE
            }
          }
        )
      }

      // Kiểm tra xem gói VIP sắp hết hạn trong vòng 3 ngày
      const expiring = (endDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24) // Số ngày còn lại
      const vipRenew = await databaseService.vip_user_details.findOne({
        _id: vipUser._id,
        status: VIP_STATUS.RENEW
      })
      const vipPackage = await databaseService.vip_packages.findOne({
        _id: vipUser.package_id
      })
      const user = await databaseService.users.findOne({
        _id: vipUser.user_id
      })

      if (expiring <= 3 && vipUser.status === VIP_STATUS.ACTIVE && !vipRenew) {
        await databaseService.vip_user_details.findOneAndUpdate(
          {
            _id: vipUser._id
          },
          {
            $set: {
              current_active: true,
              status: VIP_STATUS.EXPIRING
            }
          }
        )
        if (!user || !vipPackage || !vipUser) {
          console.log('Không tìm thấy thông tin user hoặc gói vip hoặc thông tin vip user')
          return
        }
        await sendEmailWarningVipExpire({
          subject: ' Thông báo gói vip sắp hết hạn',
          user: user,
          vip_detail: vipUser,
          vip_package: vipPackage
        })
      }
    }
    console.log('Cập nhật trạng thái vip')
  } catch (error) {
    console.log(error)
  }
})

// Routes
app.post('/api/orders', async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const payload = req.body as { id: string; name: string; price: number }
    const { jsonResponse, httpStatusCode } = await paypalService.createOrder(payload)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
})
app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params
    const { jsonResponse, httpStatusCode } = await paypalService.captureOrder(orderID)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to capture order.' })
  }
})
app.use('/users', userRoutes)
app.use('/upload', uploadImagesRoutes)
app.use('/upload-video', videoRoutes)
app.use('/properties', propertiesRoutes)
app.use('/comments', commentsRoutes)
app.use('/favorites', favoritesRoutes)
app.use('/reports-interaction', reportsInteractionRoutes)
app.use('/news', newsRoutes)
app.use('/vip-packages', vipPackagesRoutes)
app.use('/payments', paymentsRoutes)
app.use('/user-vips', vipUserDetailsRoutes)
app.use('/chat', chatRouter)
app.use('/messages', messageRouter)

app.use(defaultErrorHandler)
app.listen(env_config.SERVER_PORT, async () => {
  console.log('Server is running on port 5010')
})
