const getFlushList = async (handicapped: boolean, changingstation:boolean, free:boolean) =>{
    const response = await fetch(`http://localhost:3000/flush?handicapped=${handicapped}&changingstation=${changingstation}&free=${free}`);
    const flushList = await response.json();
    console.log(flushList);
    return flushList;
}


const showFlushList = async () => {
    const response = await fetch(`http://localhost:3000/flush/`);
    const flushList = await response.json();
    console.log(flushList);
    return flushList;
}

 
export {
    getFlushList, showFlushList
}