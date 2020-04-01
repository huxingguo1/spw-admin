import request from '@/utils/request'

export function addCommunity(data) {
  return request({
    url: '/admin/community/add',
    method: 'post',
    data
  })
}

export function updateCommunity(data) {
  return request({
    url: '/admin/community/update',
    method: 'post',
    data
  })
}

export function queryCommunitys(data) {
  return request({
    url: '/admin/community/list',
    method: 'post',
    data
  })
}

export function queryCommunitysByRegion(data) {
  return request({
    url: '/admin/community/list/region',
    method: 'post',
    data
  })
}

export function deleteCommunity(communityId) {
  return request({
    url: '/admin/community/delete',
    method: 'post',
    params: { communityId }
  })
}

export function queryProfile(communityId) {
  return request({
    url: '/admin/community/profile',
    method: 'post',
    params: { communityId }
  })
}
