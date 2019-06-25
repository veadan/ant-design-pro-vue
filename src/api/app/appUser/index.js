import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/app/admin/appUser/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/app/admin/appUser',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/app/admin/appUser/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/app/admin/appUser/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/app/admin/appUser/' + id,
    method: 'put',
    data: obj
  })
}
