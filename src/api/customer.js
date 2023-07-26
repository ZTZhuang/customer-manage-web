import request from '@/utils/request'

export function getCustomerList(data) {
  return request({
    url: '/api/customer',
    method: 'get',
    data
  })
}

export function addCustomer(data) {
  return request({
    url: '/api/customer',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: `/api/customer/${data.id}`,
    method: 'patch',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: `/api/customer/${id}`,
    method: 'delete'
  })
}
