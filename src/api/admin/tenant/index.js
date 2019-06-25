import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/tenant/' + id,
    method: 'put',
    data: obj
  })
}

export function updateUser (id, obj) {
  return axios({
    url: '/admin/tenant/' + id + '/user',
    method: 'put',
    params: obj
  })
}

export function getOwner (id) {
  return axios({
    url: '/admin/tenant/' + id + '/user',
    method: 'get'
  })
}
