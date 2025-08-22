const RequestsHis = ({ reqhistory, autofillHistoryHandler }) => {
    const revArr = [];
    for(let i = reqhistory.length-1; i >= 0; i--){
        revArr.push(reqhistory[i]); 
    } 

    return (
        <div className="req-container">
            {
                revArr.length > 0 ? revArr.map((payload, idx) => {
                    const str = `${payload.method}: ${payload.url}`;
                    return (
                        <div className="req" key={idx} onClick={() => autofillHistoryHandler(payload)}>
                            <div>{str.length > 40 ? str.slice(0, 40)+"...." : str}</div>
                        </div>
                    )
                })
                :
                <div>No Requests found...</div>
            }
        </div>
    )

}

export default RequestsHis;