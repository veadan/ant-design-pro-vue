import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/auth/oauthClientDetails/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/auth/oauthClientDetails',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/auth/oauthClientDetails/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/auth/oauthClientDetails/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/auth/oauthClientDetails/' + id,
    method: 'put',
    data: obj
  })
}
