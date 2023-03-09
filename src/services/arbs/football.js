import { formatQuery } from "../common"

export const getFootballArbs = async (queryObj) => {
    const query = formatQuery(queryObj)
    return await fetch(`${process.env.REACT_APP_URL}/arbs/football${query ? '?' + query : ''}`, {
        // headers: {
        // 	Authorization: `Bearer ${cookies.token}`,
        // },
    })
}