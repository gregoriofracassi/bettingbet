export const formatQuery = (queryObj) => {
    let queryString = ''
    if (queryObj.sort.active) {
        const sortQuery = queryObj.sort.value
        const sortString = `sort=${sortQuery[sortQuery.sortBy] ? '' : '-'}${sortQuery.sortBy}&limit=${queryObj.limit}`
        queryString += sortString
    }
    return queryString
}