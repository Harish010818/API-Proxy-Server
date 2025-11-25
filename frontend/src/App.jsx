import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import RequestsHis from "./components/Sidebar";
import MainContainer from "./components/MainContainer";

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
        />   
      </div>
    </>
  );
}

export default App;