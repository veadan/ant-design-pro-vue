import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/user/' + id,
    method: 'put',
    data: obj
  })
}

export function changePassword (data) {
  return axios({
    url: '/admin/user/changePassword',
    method: 'post',
    params: data
  })
}
