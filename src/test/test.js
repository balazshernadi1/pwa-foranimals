function splitSortBy(sortBy){
    console.log(sortBy)
    if (sortBy === 'none'){
        return {field : null, order :null}
    }else{
        match1 = sortBy.match(/^(age|date)/)
        match2 = sortBy.match(/(Asc|Desc)$/)
        
        const field = match1 ? match1[0] : null
        const order = match2 ? match2[0].toLowerCase() : null
        return {field, order}
    }
    
}


const {field, order} = splitSortBy("ageDesc")

console.log(field)

console.log(order)
