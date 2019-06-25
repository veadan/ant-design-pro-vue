import { axios } from '@/utils/request'

export function getAllGroupTypes () {
  return axios({
    url: '/admin/groupType/all',
    method: 'get'
  })
}

export function fetchTree (query) {
  return axios({
    url: '/admin/group/tree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/group',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/group/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/group/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/group/' + id,
    method: 'put',
    data: obj
  })
}

export function getUsers (id) {
  return axios({
    url: '/admin/group/' + id + '/user',
    method: 'get'
  })
}

export function modifyUsers (id, data) {
  return axios({
    url: '/admin/group/' + id + '/user',
    method: 'put',
    params: data
  })
}

export function removeElementAuthority (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  })
}

export function addElementAuthority (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authority/element/add',
    method: 'post',
    params: data
  })
}

export function getElementAuthority (id) {
  return axios({
    url: '/admin/group/' + id + '/authority/element',
    method: 'get'
  })
}

export function modifyMenuAuthority (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authority/menu',
    method: 'post',
    params: data
  })
}

export function getMenuAuthority (id) {
  return axios({
    url: '/admin/group/' + id + '/authority/menu',
    method: 'get'
  })
}

export function removeElementAuthorize (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authorize/element/remove',
    method: 'post',
    params: data
  })
}

export function addElementAuthorize (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authorize/element/add',
    method: 'post',
    params: data
  })
}

export function getElementAuthorize (id) {
  return axios({
    url: '/admin/group/' + id + '/authorize/element',
    method: 'get'
  })
}

export function modifyMenuAuthorize (id, data) {
  return axios({
    url: '/admin/group/' + id + '/authorize/menu',
    method: 'post',
    params: data
  })
}

export function getMenuAuthorize (id) {
  return axios({
    url: '/admin/group/' + id + '/authorize/menu',
    method: 'get'
  })
}

export function pageAuthorize (query) {
  return axios({
    url: '/admin/group/element/authorize/list',
    method: 'get',
    params: query
  })
}

export function fetchAuthorizeTree () {
  return axios({
    url: '/admin/group/menu/authorize/list',
    method: 'get'
  })
}

// 服务器状态
export function getNumber () {
  return axios({
    url: '/monitor/serviceMonitor/brief',
    method: 'get'
  })
}

// 服务列表
export function getServiceMonitor (page, limit) {
  return axios({
    url: `/api/monitor/serviceMonitor/page?page=${page}&limit=${limit}`,
    method: 'get'
  })
}

// 每分钟监控
export function getMapDataForDay () {
  return axios({
    url: '/monitor/tranceRecord/viser/getMapDataForOneHour',
    method: 'get'
  })
}

// 每月监控
export function getMapDataForMonth () {
  return axios({
    url: '/monitor/tranceRecordDay/viser/getMapDataForDay',
    method: 'get'
  })
}

// 告警信息管理
export function getUnreadMessage () {
  return axios({
    url: '/monitor/monitorEvent/viser/getUnreadMessage',
    method: 'get'
  })
}
