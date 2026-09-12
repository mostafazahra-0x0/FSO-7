import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}
const getById = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, newObject, config)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  return axios
    .put(`${baseUrl}/${id}`, newObject, config)
    .then((response) => response.data)
}
const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.delete(`${baseUrl}/${id}`, config)
}
const addComment = (id, comment) => {
  const request = axios.post(`${baseUrl}/${id}/comments`, { comment })
  return request.then((response) => response.data)
}
export default { getAll, setToken, create, update, remove, getById, addComment }
