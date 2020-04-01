import request from '@/utils/request'
export function typeQuery(id) {
  return request({
    url: '/admin/smmCommodityType/query',
    method: 'post',
    params: { id }
  })
}
export function queryAllList() {
  return request({
    url: '/admin/smmCommodityType/queryAllList',
    method: 'post'
  })
}
export function createCommodity(data) {
  return request({
    url: '/admin/commodity/add',
    method: 'post',
    data
  })
}

export function getDistributor(data) {
  return request({
    url: '/ad/aupplier/select/query',
    method: 'post',
    data
  })
}

