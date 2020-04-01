import request from '@/utils/request'
export function upload(data) {
  return request({
    url: '/admin/qiniu/upload',
    method: 'post',
    data
  })
}
