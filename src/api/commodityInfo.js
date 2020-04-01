import request from '@/utils/request'
export function commodityInfo(id) {
  return request({
    url: '/admin/commodity/info',
    method: 'post',
    params: { id }
  })
}
export function commodityDetailsUpdate(data) {
  return request({
    url: '/admin/commodity/details/update',
    method: 'post',
    data
  })
}
export function querySpec(data) {
  return request({
    url: '/admin/spec/query',
    method: 'post',
    data
  })
}
export function queryAttribute(data) {
  return request({
    url: '/admin/attribute/query',
    method: 'post',
    data
  })
}
export function createSpec(data) {
  return request({
    url: '/admin/spec/add',
    method: 'post',
    data
  })
}
export function createArrt(data) {
  return request({
    url: '/admin/attribute/add',
    method: 'post',
    data
  })
}
export function querySku(data) {
  return request({
    url: '/admin/sku/query',
    method: 'post',
    data
  })
}
export function attributeName(commodityId) {
  return request({
    url: '/admin/spec/name/value',
    method: 'post',
    params: { commodityId }
  })
}
export function createSku(data) {
  return request({
    url: '/admin/sku/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/admin/spec/update',
    method: 'post',
    data
  })
}
export function deleteSpec(id, commodityId) {
  return request({
    url: '/admin/spec/delete',
    method: 'post',
    params: { id, commodityId }
  })
}
export function editAttr(data) {
  return request({
    url: '/admin/attribute/edit',
    method: 'post',
    data
  })
}
export function deleteAttr(id) {
  return request({
    url: '/admin/attribute/delete',
    method: 'post',
    params: { id }
  })
}
export function editSku(data) {
  return request({
    url: '/admin/sku/edit',
    method: 'post',
    data
  })
}
export function removeSku(id) {
  return request({
    url: '/admin/sku/delete',
    method: 'post',
    params: { id }
  })
}
export function updateTin(id, richText) {
  return request({
    url: '/admin/commodity/richtext/update',
    method: 'post',
    params: { id, richText }
  })
}
