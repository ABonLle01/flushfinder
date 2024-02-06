const getFlushList = async (handicapped: boolean, changingstation:boolean, free:boolean) =>{
    /* const response = await fetch(`http://localhost:3000/flush?handicapped=${handicapped}&changingstation=${changingstation}&free=${free}`); */
    
    let url = "https://api.flushfinder.es/flush?";
    /* let url = 'http://localhost:3000/flush?'; */
    if (handicapped) {
        url += 'handicapped=true&';
    }
    if (changingstation) {
        url += 'changingstation=true&';
    }
    if (free) {
        url += 'free=true&';
    }

    url = url.slice(0, -1);

    const response = await fetch(url);
    
    const flushList = await response.json();
    console.log(flushList);
    return flushList;
}
 
export {
    getFlushList
}