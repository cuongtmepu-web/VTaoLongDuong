import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/api/stores/auth'

// ===== PUBLIC ROUTES =====
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/landing/LandingPage.vue'),
  },
  {
    path: '/bai-thuoc',
    name: 'Blog',
    component: () => import('@/views/landing/BlogList.vue'),
  },
  {
    path: '/bai-thuoc/:slug',
    name: 'BlogDetail',
    component: () => import('@/views/landing/BlogDetail.vue'),
  },
  {
    path: '/bac-si',
    name: 'Doctors',
    component: () => import('@/views/landing/DoctorsPage.vue'),
  },
  {
    path: '/bac-si/:id',
    name: 'DoctorDetail',
    component: () => import('@/views/landing/DoctorDetail.vue'),
  },
  {
    path: '/lien-he',
    name: 'Contact',
    component: () => import('@/views/landing/ContactPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dang-ky',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { guestOnly: true },
  },

  // ===== USER ROUTES =====
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'User' },
    children: [
      {
        path: '',
        redirect: '/user/dashboard',
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('@/views/user/UserDashboard.vue'),
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/profile/ProfileInfo.vue'),
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/user/profile/ChangePassword.vue'),
      },
      {
        path: 'appointments',
        name: 'UserAppointments',
        component: () => import('@/views/user/appointments/AppointmentList.vue'),
      },
      {
        path: 'appointments/book',
        name: 'BookAppointment',
        component: () => import('@/views/user/appointments/BookAppointment.vue'),
      },
      {
        path: 'appointments/:id',
        name: 'AppointmentDetail',
        component: () => import('@/views/user/appointments/AppointmentDetail.vue'),
      },
      {
        path: 'medical-records',
        name: 'MedicalRecords',
        component: () => import('@/views/user/medical-records/MedicalRecordList.vue'),
      },
      {
        path: 'medical-records/:id',
        name: 'MedicalRecordDetail',
        component: () => import('@/views/user/medical-records/MedicalRecordDetail.vue'),
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/orders/OrderList.vue'),
      },
      {
        path: 'orders/:id',
        name: 'UserOrderDetail',
        component: () => import('@/views/user/orders/OrderDetail.vue'),
      },
      {
        path: 'payment/result',
        name: 'PaymentResult',
        component: () => import('@/views/user/payments/PaymentResult.vue'),
      },
    ],
  },

  // ===== ADMIN ROUTES =====
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
      },
      // User Management
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/admin/users/UserList.vue'),
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('@/views/admin/users/UserDetail.vue'),
      },
      // Doctor Management
      {
        path: 'doctors',
        name: 'DoctorList',
        component: () => import('@/views/admin/doctors/DoctorList.vue'),
      },
      {
        path: 'doctors/create',
        name: 'DoctorCreate',
        component: () => import('@/views/admin/doctors/DoctorForm.vue'),
      },
      {
        path: 'doctors/:id/edit',
        name: 'DoctorEdit',
        component: () => import('@/views/admin/doctors/DoctorForm.vue'),
      },
      {
        path: 'doctors/:id/schedule',
        name: 'DoctorSchedule',
        component: () => import('@/views/admin/doctors/DoctorSchedule.vue'),
      },
      // Appointment Management
      {
        path: 'appointments',
        name: 'AdminAppointments',
        component: () => import('@/views/admin/appointments/AppointmentList.vue'),
      },
      {
        path: 'appointments/:id',
        name: 'AdminAppointmentDetail',
        component: () => import('@/views/admin/appointments/AppointmentDetail.vue'),
      },
      {
        path: 'appointments/calendar',
        name: 'AppointmentCalendar',
        component: () => import('@/views/admin/appointments/CalendarView.vue'),
      },
      // Medical Records
      {
        path: 'medical-records',
        name: 'AdminMedicalRecords',
        component: () => import('@/views/admin/medical-records/RecordList.vue'),
      },
      {
        path: 'medical-records/create',
        name: 'CreateMedicalRecord',
        component: () => import('@/views/admin/medical-records/RecordForm.vue'),
      },
      {
        path: 'medical-records/:id/edit',
        name: 'EditMedicalRecord',
        component: () => import('@/views/admin/medical-records/RecordForm.vue'),
      },
      // Blog Management
      {
        path: 'blog/categories',
        name: 'BlogCategoryList',
        component: () => import('@/views/admin/blog/CategoryList.vue'),
      },
      {
        path: 'blog/categories/create',
        name: 'CreateBlogCategory',
        component: () => import('@/views/admin/blog/CategoryForm.vue'),
      },
      {
        path: 'blog/categories/:id/edit',
        name: 'EditBlogCategory',
        component: () => import('@/views/admin/blog/CategoryForm.vue'),
      },
      {
        path: 'blog/posts',
        name: 'BlogPostList',
        component: () => import('@/views/admin/blog/PostList.vue'),
      },
      {
        path: 'blog/posts/create',
        name: 'CreateBlogPost',
        component: () => import('@/views/admin/blog/PostForm.vue'),
      },
      {
        path: 'blog/posts/:id/edit',
        name: 'EditBlogPost',
        component: () => import('@/views/admin/blog/PostForm.vue'),
      },
      // Orders
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('@/views/admin/orders/OrderList.vue'),
      },
      {
        path: 'orders/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/orders/OrderDetail.vue'),
      },
      // Landing Page Editor
      {
        path: 'landing',
        name: 'LandingEditor',
        component: () => import('@/views/admin/landing/LandingEditor.vue'),
      },
      {
        path: 'landing/section/:sectionKey',
        name: 'SectionEditor',
        component: () => import('@/views/admin/landing/SectionEditor.vue'),
      },
      // Settings
      {
        path: 'settings/general',
        name: 'GeneralSettings',
        component: () => import('@/views/admin/settings/GeneralSettings.vue'),
      },
      {
        path: 'settings/payment',
        name: 'PaymentSettings',
        component: () => import('@/views/admin/settings/PaymentSettings.vue'),
      },
      // Reports
      {
        path: 'reports/revenue',
        name: 'RevenueReport',
        component: () => import('@/views/admin/reports/RevenueReport.vue'),
      },
      {
        path: 'reports/appointments',
        name: 'AppointmentReport',
        component: () => import('@/views/admin/reports/AppointmentReport.vue'),
      },
    ],
  },

  // ===== 404 NOT FOUND =====
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue'),
  },
]

// ===== CREATE ROUTER =====
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// ===== NAVIGATION GUARD =====
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!token) {
      // Redirect to login if not authenticated
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check if route requires specific role
    if (to.meta.role) {
      if (to.meta.role !== userRole) {
        // Redirect to appropriate dashboard
        if (userRole === '1') {
          next('/admin/dashboard')
        } else if (userRole === '3') {
          next('/user/dashboard')
        } else {
          next('/login')
        }
        return
      }
    }

    next()
    return
  }

  // Check if route is for guests only (login/register)
  if (to.meta.guestOnly && token) {
    // Redirect authenticated users away from login/register
    if (userRole === '1') {
      next('/admin/dashboard')
    } else {
      next('/user/dashboard')
    }
    return
  }

  next()
})

export default router
