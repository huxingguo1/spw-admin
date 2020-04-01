import request from '@/utils/request'
export function mygoodsQuery(data) {
  return request({
    url: '/admin/goods/query',
    method: 'post',
    data
  })
}

export function getaddList(data) {
  return request({
    url: '/admin/goods/commodity/query',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/admin/goods/save',
    method: 'post',
    data
  })
}

export function updateStorgae(data) {
  return request({
    url: '/admin/goods/updateStorage',
    method: 'post',
    data
  })
}

export function upGoods(id) {
  return request({
    url: '/admin/goods/up',
    method: 'post',
    params: { id }
  })
}

export function downGoods(id) {
  return request({
    url: '/admin/goods/down',
    method: 'post',
    params: { id }
  })
}
