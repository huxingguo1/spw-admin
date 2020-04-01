import request from '@/utils/request'

export function listOrder(data) {
  return request({
    url: '/admin/order/query',
    method: 'post',
    data
  })
}

export function handleShip(data) {
  return request({
    url: '/admin/order/distribution',
    method: 'post',
    data
  })
}

export function getVolunteer(data) {
  return request({
    url: '/admin/user/v/list',
    method: 'post',
    data
  })
}

export function getOrderCount(data) {
  return request({
    url: '/admin/order/count/query',
    method: 'post',
    data
  })
}

