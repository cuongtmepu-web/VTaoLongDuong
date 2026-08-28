import { defineStore } from 'pinia'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()

export interface Notification {
  notificationId: number
  userId: number
  title: string
  content: string
  type: 'Appointment' | 'Payment' | 'System' | 'Blog'
  relatedId?: number
  isRead: boolean
  createdAt: string
  readAt?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
  }),

  getters: {
    unreadNotifications: (state) => state.notifications.filter((n) => !n.isRead),

    getNotificationById: (state) => (id: number) =>
      state.notifications.find((n) => n.notificationId === id),
  },

  actions: {
    async fetchNotifications(): Promise<void> {
      this.loading = true
      try {
        // TODO: Implement API call when backend is ready
        // const response = await notificationApi.getAll()
        // if (response.data.success) {
        //   this.notifications = response.data.data
        //   this.unreadCount = this.notifications.filter(n => !n.isRead).length
        // }

        // Mock data for testing
        this.notifications = [
          {
            notificationId: 1,
            userId: 1,
            title: 'Lịch hẹn mới',
            content: 'Bạn có lịch hẹn với bác sĩ Nguyễn Văn A vào ngày 15/12/2024',
            type: 'Appointment',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            notificationId: 2,
            userId: 1,
            title: 'Thanh toán thành công',
            content: 'Đơn hàng TLD202412050001 đã được thanh toán thành công',
            type: 'Payment',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ]
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId: number): Promise<void> {
      try {
        // TODO: Implement API call
        // await notificationApi.markAsRead(notificationId)

        const notification = this.notifications.find((n) => n.notificationId === notificationId)
        if (notification && !notification.isRead) {
          notification.isRead = true
          notification.readAt = new Date().toISOString()
          this.unreadCount = this.notifications.filter((n) => !n.isRead).length
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    },

    async markAllAsRead(): Promise<void> {
      try {
        // TODO: Implement API call
        // await notificationApi.markAllAsRead()

        this.notifications.forEach((n) => {
          if (!n.isRead) {
            n.isRead = true
            n.readAt = new Date().toISOString()
          }
        })
        this.unreadCount = 0
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
      }
    },

    async deleteNotification(notificationId: number): Promise<void> {
      try {
        // TODO: Implement API call
        // await notificationApi.delete(notificationId)

        this.notifications = this.notifications.filter((n) => n.notificationId !== notificationId)
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length
      } catch (error) {
        console.error('Failed to delete notification:', error)
      }
    },

    addNotification(notification: Omit<Notification, 'notificationId'>): void {
      // For real-time notifications from WebSocket
      const newNotification: Notification = {
        ...notification,
        notificationId: Date.now(),
      }
      this.notifications.unshift(newNotification)
      this.unreadCount = this.notifications.filter((n) => !n.isRead).length

      // Show toast notification
      toast.info(notification.title, {
        timeout: 5000,
        onClick: () => {
          // Handle click on toast
        },
      } as any)
    },
  },
})
