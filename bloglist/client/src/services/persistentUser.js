const key = 'loggedBlogAppUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(key)
  return userJSON ? JSON.parse(userJSON) : null
}

const saveUser = (user) => {
  window.localStorage.setItem(key, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(key)
}

export default { getUser, saveUser, removeUser }