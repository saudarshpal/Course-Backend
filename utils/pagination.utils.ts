export const paginationOptions = (queryPage? : any , queryLimit? : any)=>{
    const page = Math.max(1,parseInt(queryPage)|| 1);
    const limit = Math.max(1,parseInt(queryLimit)|| 1);
    const skip = (page-1)*limit

    return {page,limit,skip}
}

export interface PaginationResult<T> {
    data : T[],
    total : number,
    page : number,
    limit : number
}