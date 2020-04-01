import request from '@/utils/request'

export function addStation(data) {
  return request({
    url: '/admin/station/add',
    method: 'post',
    data
  })
}

export function updateStation(data) {
  return request({
    url: '/admin/station/update',
    method: 'post',
    data
  })
}

export function queryStations(data) {
  return request({
    url: '/admin/station/list',
    method: 'post',
    data
  })
}

export function deleteStation(stationId) {
  return request({
    url: '/admin/station/delete',
    method: 'post',
    params: { stationId }
  })
}

export function queryStationProfile(stationId) {
  return request({
    url: '/admin/station/profile',
    method: 'post',
    params: { stationId }
  })
}

export function stationCount() {
  return request({
    url: '/admin/station/count',
    method: 'post'
  })
}
