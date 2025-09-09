import { reactive } from 'vue'
import type { GetGroupsResponse } from './api'

export const store = reactive({
  groups: [] as GetGroupsResponse[]
})