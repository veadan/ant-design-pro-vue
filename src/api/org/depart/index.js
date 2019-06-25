import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/depart/page',
    method: 'get',
    params: query
  })
}

export function addDepartObj (obj) {
  return axios({
    url: '/admin/depart',
    method: 'post',
    data: obj
  })
}

export function getDepartObj (id) {
  return axios({
    url: '/admin/depart/' + id,
    method: 'get'
  })
}

export function delDepartObj (id) {
  return axios({
    url: '/admin/depart/' + id,
    method: 'delete'
  })
}

export function putDepartObj (id, obj) {
  return axios({
    url: '/admin/depart/' + id,
    method: 'put',
    data: obj
  })
}

export function getTree () {
  return axios({
    url: '/admin/depart/tree',
    method: 'get'
  })
}

export function addUserObj (data) {
  return axios({
    url: '/admin/depart/user',
    method: 'post',
    params: data
  })
}

export function delUserObj (data) {
  return axios({
    url: '/admin/depart/user',
    method: 'delete',
    params: data
  })
}

export function getUsers (query) {
  return axios({
    url: '/admin/depart/user',
    method: 'get',
    params: query
  })
}
