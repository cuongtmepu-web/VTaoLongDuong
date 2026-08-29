<template>
  <AdminLayout>
    <div class="post-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">{{ isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới' }}</h2>
        <router-link to="/admin/blog/posts" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-control" v-model="form.title" required />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Slug *</label>
                <input type="text" class="form-control" v-model="form.slug" required />
                <small class="text-muted">Ví dụ: bai-thuoc-chua-dau-dau</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Danh mục *</label>
                <select class="form-select" v-model="form.categoryId" required>
                  <option value="">Chọn danh mục</option>
                  <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                    {{ cat.categoryName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Tóm tắt</label>
              <textarea class="form-control" v-model="form.summary" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Nội dung *</label>
              <QuillEditor
                v-model:content="form.content"
                theme="snow"
                toolbar="full"
                content-type="html"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">URL ảnh đại diện</label>
              <input type="text" class="form-control" v-model="form.featuredImageUrl" />
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.isPublished"
                    id="publishSwitch"
                  />
                  <label class="form-check-label" for="publishSwitch">Đăng ngay</label>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.isFeatured"
                    id="featuredSwitch"
                  />
                  <label class="form-check-label" for="featuredSwitch">Bài nổi bật</label>
                </div>
              </div>
            </div>

            <hr />

            <h6>SEO</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Meta Title</label>
                <input type="text" class="form-control" v-model="form.metaTitle" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Meta Description</label>
                <input type="text" class="form-control" v-model="form.metaDescription" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Meta Keywords</label>
              <input type="text" class="form-control" v-model="form.metaKeywords" />
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEdit ? 'Cập nhật' : 'Đăng bài' }}
              </button>
              <router-link to="/admin/blog/posts" class="btn btn-secondary">Hủy</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminBlogApi } from '@/api/admin/adminBlog'
import type { BlogCategory } from '@/api/types/blog'
import { useToast } from '@erag/vue-toastification'
import { QuillEditor } from '@vueup/vue-quill'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const submitting = ref(false)
const categories = ref<BlogCategory[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  categoryId: null as number | null,
  title: '',
  slug: '',
  summary: '',
  content: '',
  featuredImageUrl: '',
  isPublished: false,
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
})

const fetchCategories = async () => {
  try {
    const response = await adminBlogApi.getCategories()
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách danh mục')
  }
}

const fetchPost = async () => {
  const id = route.params.id as string
  if (!id) return

  try {
    const response = await adminBlogApi.getPostById(parseInt(id))
    if (response.data.success) {
      const data = response.data.data
      Object.assign(form, {
        categoryId: data.categoryId,
        title: data.title,
        slug: data.slug,
        summary: data.summary || '',
        content: data.content,
        featuredImageUrl: data.featuredImageUrl || '',
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
      })
    }
  } catch (error) {
    toast.error('Không thể tải thông tin bài viết')
    router.push('/admin/blog/posts')
  }
}

const handleSubmit = async () => {
  if (!form.categoryId || !form.title || !form.slug || !form.content) {
    toast.warning('Vui lòng nhập đầy đủ thông tin')
    return
  }

  submitting.value = true
  try {
    const data = {
      categoryId: form.categoryId,
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      featuredImageUrl: form.featuredImageUrl,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      metaKeywords: form.metaKeywords,
    }

    let response
    if (isEdit.value) {
      response = await adminBlogApi.updatePost(parseInt(route.params.id as string), data)
    } else {
      response = await adminBlogApi.createPost(data)
    }

    if (response.data.success) {
      toast.success(isEdit.value ? 'Cập nhật bài viết thành công' : 'Đăng bài thành công')
      router.push('/admin/blog/posts')
    }
  } catch (error) {
    toast.error('Lưu thông tin thất bại')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
  if (isEdit.value) {
    fetchPost()
  }
})
</script>

<style scoped>
.post-form {
  padding: 20px;
}

:deep(.ql-editor) {
  min-height: 300px;
}
</style>
