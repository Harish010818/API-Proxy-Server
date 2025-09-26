import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import RequestsHis from "./components/RequestsHis";

function App() {

  // Payload
  const [payload, setPayLoad] = useState({
    url: "",
    method: "GET",
    headers: {},
    body: {}
    // params: {},
  });

  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");

  const [bodyText, setBodyText] = useState("");

  const [res, setRes] = useState("");

  const [reqhistory, setReqHistory] = useState([]);


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("req")) || [];
    setReqHistory(data);
  }, [])



  //Handle url/method
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayLoad((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Body change
  const bodyChangeHandler = (e) => {
    setBodyText(e.target.value);
    try {
      const body = JSON.parse(e.target.value);

      setPayLoad((prevState) => ({
        ...prevState,
        body: body,
      }));


    } catch (error) {
      console.error("Invalid JSON format in body");
    }
  };


  // Add header
  const addHeader = () => {
    if (headerKey && headerValue) {
      setPayLoad((prevState) => ({
        ...prevState,
        headers: {
          ...prevState.headers,
          [headerKey]: headerValue,
        },
      }));
      toast.success("Headers Added");
      setHeaderKey("");
      setHeaderValue("");
    }
  };

  // Send request
  const sendRequestHandler = async (e) => {
    e.preventDefault();

    if (!payload.url) {
      toast.error("URL cannot be empty");
      return;
    }

    const storeReqs = [...reqhistory, payload]
    setReqHistory(storeReqs);
    localStorage.setItem("req", JSON.stringify(storeReqs));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const result = await response.json();
      
      
      if (result.data) {
        if(typeof result.data === "object"){
          setRes(JSON.stringify(result.data, null, 2)); // pretty JSON
        } else {
          setRes("Error: " + JSON.stringify(result.data, null, 2));
        }
      } else {
        setRes("Error: Could not send request")
      }
    } catch (err) {
      setRes("Error: " + JSON.stringify(err?.message, null, 2));
    }
  };

  const autofillHistoryHandler = (data) => {

    setPayLoad((prevState) => ({
      ...prevState,
      url: data.url,
      method: data.method
    }))

    const objHeader = data.headers;
    if (objHeader && Object.keys(objHeader).length > 0) {
      setHeaderKey(Object.keys(objHeader)[0]);
      setHeaderValue(Object.values(objHeader)[0]);

    } else {
      setHeaderKey("");
      setHeaderValue("");
    }

    const objBody = data.body;
    if (objBody && Object.keys(objBody).length > 0) {
      setPayLoad((prevState) => ({
        ...prevState,
        body: objBody
      }));

      setBodyText(JSON.stringify(objBody, null, 2));
    } else {
      setPayLoad((prevState) => ({
        ...prevState,
        body: {}
      }));
      setBodyText("");
    }

    console.log(payload);
    setRes("");
  }

  return (
    <>
      <div className="main-container">
        <RequestsHis
          reqhistory={reqhistory}
          autofillHistoryHandler={autofillHistoryHandler}
        />

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
            <h3>Response below here :</h3>
            <textarea 
              rows="15" 
              cols="133" 
              value={res} readOnly
              className={res.startsWith("Error") ? "error" : "success"}
            >
            </textarea>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
