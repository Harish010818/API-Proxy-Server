import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import RequestsHis from "./components/Sidebar";
import MainContainer from "./components/MainContainer";

function App() {

  // Payload
  const [payload, setPayLoad] = useState({
    method: "GET",
    url: "",
    headers: {},
    body: {},
  });

  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");

  const [bodyText, setBodyText] = useState("");
  const [res, setRes] = useState("");
  const [reqhistory, setReqHistory] = useState([]);
  const [status, setStatus] = useState("Null");
  const [time, setTime] = useState("0");

  
  //Handle url/method
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayLoad((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

const addHeader = () => {
  if (!headerKey || !headerValue) return;

  setPayLoad(prev => ({
    ...prev,
    headers: {
      ...prev.headers,
      [headerKey]: headerValue,
    }
  }));

  toast.success("Header Added");
  setHeaderKey("");
  setHeaderValue("");
};


  // Body change
  const bodyChangeHandler = (e) => {
    setBodyText(e.target.value);
    try {
      const body = JSON.parse(e.target.value);

      setPayLoad((prev) => ({
        ...prev,
        body: body,
      }));
    } catch (error) {
      console.error("Invalid JSON format in body");
    }
  };


  // Send request handler
  const sendRequestHandler = async (e) => {
    e.preventDefault();

    if (!payload.url) {
      toast.error("URL cannot be empty");
      return;
    }

    const storeReqs = [...reqhistory, payload];
    setReqHistory(storeReqs);
    localStorage.setItem("req", JSON.stringify(storeReqs));

    try {
      const start = performance.now(); //start time

      const response = await fetch(`${import.meta.env.VITE_API_URL}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const end = performance.now(); // end time
      const total = (end - start).toFixed(2);

      setTime(total); // show in UI

      const result = await response.json();

      if (result.data) {
        if (typeof result.data === "object") {
          setRes(JSON.stringify(result.data, null, 2));
        } else {
          setRes("Error: " + JSON.stringify(result.data, null, 2));
        }
      } else {
        setRes("Error: Could not send request");
      }
      setStatus(result.status); // show status
    } catch (err) {
      setRes("Error: " + JSON.stringify(err?.message, null, 2));
      setStatus(result.status); // show status
    }
  };


  // autofill history on the form handler
  const autofillHistoryHandler = (data) => {
    setPayLoad((prev) => ({
      ...prev,
      url: data.url,
      method: data.method,
    }));

    const reqHeaders = data.headers;
    if (reqHeaders && Object.keys(reqHeaders).length > 0) {
      setHeaderKey(Object.keys(reqHeaders)[0]);
      setHeaderValue(Object.values(reqHeaders)[0]);
    } else {
      setHeaderKey("");
      setHeaderValue("");
    }

    const reqBody = data.body;
    if (reqBody && Object.keys(reqBody).length > 0) {
      setPayLoad((prev) => ({
        ...prev,
        body: reqBody,
      }));

      setBodyText(JSON.stringify(reqBody, null, 2));
    } else {
      setPayLoad((prev) => ({
        ...prev,
        body: {},
      }));

    setBodyText("");
    }
    
    setRes("");
  };


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("req")) || [];
    setReqHistory(data);
  }, []);


  return (
    <>
      <div className="main-container">
        <RequestsHis
          reqhistory={reqhistory}
          autofillHistoryHandler={autofillHistoryHandler}
        />

        <MainContainer
          payload={payload}
          handleChange={handleChange}
          sendRequestHandler={sendRequestHandler}
          headerKey={headerKey}
          setHeaderKey={setHeaderKey}
          headerValue={headerValue}
          setHeaderValue={setHeaderValue}
          addHeader={addHeader}
          bodyText={bodyText}
          bodyChangeHandler={bodyChangeHandler}
          res={res}
          setRes={setRes}
          time={time}
          status={status}
        />
      </div>
    </>
  );
}

export default App;
