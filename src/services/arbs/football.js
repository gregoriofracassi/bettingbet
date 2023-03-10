import { formatQuery } from "../common"

export const getFootballArbs = async (queryObj, link) => {
    let url = ''
    if (link) {
        url = process.env.REACT_APP_URL + link
    } else {
        const query = formatQuery(queryObj)
        url = `${process.env.REACT_APP_URL}/arbs/football${query ? '?' + query : ''}`
    }
    return await fetch(url, {
        // headers: {
        // 	Authorization: `Bearer ${cookies.token}`,
        // },
    })
}