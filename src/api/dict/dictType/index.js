import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/dict/dictType/page',
    method: 'get',
    params: query
  })
}

export function addTypeObj (obj) {
  return axios({
    url: '/dict/dictType',
    method: 'post',
    data: obj
  })
}

export function getTypeObj (id) {
  return axios({
    url: '/dict/dictType/' + id,
    method: 'get'
  })
}

export function delTypeObj (id) {
  return axios({
    url: '/dict/dictType/' + id,
    method: 'delete'
  })
}

export function putTypeObj (id, obj) {
  return axios({
    url: '/dict/dictType/' + id,
    method: 'put',
    data: obj
  })
}

export function getTree () {
  return axios({
    url: '/dict/dictType/tree',
    method: 'get'
  })
}
