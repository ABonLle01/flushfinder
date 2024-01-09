

const getFlushList = async () =>{
    // const response = await fetch("http://example.com/movies.json");
    // const flushList = await response.json();
    // console.log(flushList);

    // return flushList;
    return [
        {
            score: 4
        },
        {
            score: 3
        },
        {
            score: 2
        },
        {
            score: 1
        },
        {
            score: 0
        },
    ]
}


export {
    getFlushList
}