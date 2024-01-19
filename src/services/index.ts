const getFlushList = async (handicaped: boolean) =>{
    const response = await fetch(`https://api.flushfinder.es/flushes?handicaped=${handicaped}`);
    const flushList = await response.json();
    console.log(flushList);
 
    return flushList;
}
 
 
export {
    getFlushList
}