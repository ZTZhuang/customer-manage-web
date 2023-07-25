import request from '@/utils/request'

export function getAccountList(data) {
  return request({
    url: '/api/user',
    method: 'get',
    data
  })
}

export function addAccount(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: `/api/user/${data.id}`,
    method: 'patch',
    data
  })
}

export function deleteAccount(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  })
}
