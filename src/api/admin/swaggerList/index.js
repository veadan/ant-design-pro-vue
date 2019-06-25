import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/swaggerList/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/swaggerList',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/swaggerList/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/swaggerList/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/swaggerList/' + id,
    method: 'put',
    data: obj
  })
}
