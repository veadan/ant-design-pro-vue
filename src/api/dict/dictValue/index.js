import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/dict/dictValue/page',
    method: 'get',
    params: query
  })
}

export function addValueObj (obj) {
  return axios({
    url: '/dict/dictValue',
    method: 'post',
    data: obj
  })
}

export function getValueObj (id) {
  return axios({
    url: '/dict/dictValue/' + id,
    method: 'get'
  })
}

export function delValueObj (id) {
  return axios({
    url: '/dict/dictValue/' + id,
    method: 'delete'
  })
}

export function putValueObj (id, obj) {
  return axios({
    url: '/dict/dictValue/' + id,
    method: 'put',
    data: obj
  })
}

export function getTypeValue (code) {
  return axios({
    url: '/dict/dictValue/type/' + code,
    method: 'get'
  })
}
