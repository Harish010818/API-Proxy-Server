const MainContainer = ({
  payload,
  handleChange,
  sendRequestHandler,
  headerKey,
  setHeaderKey,
  headerValue,
  setHeaderValue,
  addHeader,
  bodyText,
  bodyChangeHandler,
  res,
  time,
  status,
}) => {
  return (
    <>
      <div className="form-container">
        <form>
          <div className="inline-container">
            <select
              value={payload.method}
              id="method"
              name="method"
              onChange={handleChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              name="url"
              value={payload.url}
              onChange={handleChange}
              type="text"
              id="url"
              placeholder="Enter API URL"
            />

            <button type="submit" onClick={sendRequestHandler}>
              Send
            </button>
          </div>

          {/* Headers */}
          <div>
            <h3>Headers</h3>
            <div className="inline-container">
              <input
                value={headerKey}
                onChange={(e) => setHeaderKey(e.target.value)}
                type="text"
                placeholder="Content-Type"
              />
              <input
                value={headerValue}
                onChange={(e) => setHeaderValue(e.target.value)}
                type="text"
                placeholder="application/json"
              />
              <button type="button" onClick={addHeader}>
                Add to Payload
              </button>
            </div>
          </div>

          {/* Body */}
          <div>
            <h3>Body</h3>
            <textarea
              rows="6"
              cols="50"
              value={bodyText}
              onChange={bodyChangeHandler}
              placeholder='{"title":"foo","body":"bar"}'
            ></textarea>
          </div>
        </form>

        <div className="response">
  <div className="response-header">
    <h3>Response below here :</h3>

    <div className="response-meta">
      <h3>
        Status : <span className={`status ${status === 200 ? "success" : "error"}`}>{status}</span>
      </h3>
      <h3>Total time : <span className="time">{time}</span></h3> 
    </div>
  </div>

  <textarea
    rows="15"
    cols="133"
    value={res}
    readOnly
    className={res.startsWith("Error") ? "error" : "success"}
  />
</div>

      </div>
    </>
  );
};

export default MainContainer;
