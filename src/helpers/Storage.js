export const setData = (state) => {
    localStorage.setItem('cms-user', JSON.stringify(state))
}

export const removeData = () => {
    localStorage.removeItem('cms-user')
}

export const getData = () => {
    const data = localStorage.getItem('cms-user')
    return data && data !== undefined && data !== null && data !== 'undefined' ? JSON.parse(data) : null
}

export const hasUser = () => {
    const data = getData()
    return data ? true : false
}