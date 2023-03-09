export const formatQuery = (queryObj) => {
    console.log(queryObj);
    let queryString = ''
    if (queryObj.sort.active) {
        const sortQuery = queryObj.sort.value
        const sortString = `sort=${sortQuery[sortQuery.sortBy] ? '' : '-'}${sortQuery.sortBy}`
        queryString += sortString
    }
    return queryString
}