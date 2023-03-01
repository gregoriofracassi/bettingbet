export const setLoggedUser = (token) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const user = await response.json()
        dispatch({
          type: "GET_LOGGED_USER",
          payload: user,
        })
      } else {
        console.log("error")
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const logout = () => ({
  type: "LOGOUT",
})

export const setSearch = (query) => ({
  type: "SET_SEARCH_KEY",
  payload: query,
})
