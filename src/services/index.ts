

const getFlushList = async () =>{
    const response = await fetch("https://api.flushfinder.es/flushes");
    const flushList = await response.json();
    console.log(flushList);

    return flushList;
}


export {
    getFlushList
}