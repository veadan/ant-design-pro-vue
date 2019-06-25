import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/position/page',
    method: 'get',
    params: query
  })
}

export function addPositionObj (obj) {
  return axios({
    url: '/admin/position',
    method: 'post',
    data: obj
  })
}

export function getPositionObj (id) {
  return axios({
    url: '/admin/position/' + id,
    method: 'get'
  })
}

export function delPositionObj (id) {
  return axios({
    url: '/admin/position/' + id,
    method: 'delete'
  })
}

export function putPositionObj (id, obj) {
  return axios({
    url: '/admin/position/' + id,
    method: 'put',
    data: obj
  })
}

export function getUsers (id) {
  return axios({
    url: '/admin/position/' + id + '/user',
    method: 'get'
  })
}

export function modifyUsers (id, data) {
  return axios({
    url: '/admin/position/' + id + '/user',
    method: 'put',
    params: data
  })
}

export function getGroups (id) {
  return axios({
    url: '/admin/position/' + id + '/group',
    method: 'get'
  })
}

export function modifyGroups (id, data) {
  return axios({
    url: '/admin/position/' + id + '/group',
    method: 'put',
    params: data
  })
}

export function getDeparts (id) {
  return axios({
    url: '/admin/position/' + id + '/depart',
    method: 'get'
  })
}

export function modifyDeparts (id, data) {
  return axios({
    url: '/admin/position/' + id + '/depart',
    method: 'put',
    params: data
  })
}
