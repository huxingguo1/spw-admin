import request from '@/utils/request'
export function typeQuery(id) {
  return request({
    url: '/admin/smmCommodityType/query',
    method: 'post',
    params: { id }
  })
}
export function queryList(data) {
  return request({
    url: '/admin/smmCommodityType/list',
    method: 'post',
    data
  })
}
export function addType(data) {
  return request({
    url: '/admin/smmCommodityType/add',
    method: 'post',
    data
  })
}
export function getParentId(id) {
  return request({
    url: '/admin/smmCommodityType/parentId/get',
    method: 'post',
    params: { id }
  })
}
export function updateType(data) {
  return request({
    url: '/admin/smmCommodityType/update',
    method: 'post',
    data
  })
}
export function deleteType(id) {
  return request({
    url: '/admin/smmCommodityType/delete',
    method: 'post',
    params: { id }
  })
}
