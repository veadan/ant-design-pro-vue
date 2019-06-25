import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/groupType/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/groupType',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/groupType/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/groupType/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/groupType/' + id,
    method: 'put',
    data: obj
  })
}
