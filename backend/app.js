import express from "express";
import dotenv from "dotenv"; 
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());


const cache = {};
const CACHE_TTL = 60 * 1000;

app.post("/request", async (req, res) => {
  let { url, method, headers, body } = req.body;
  const cookieHeader = req.headers.cookie;
  console.log(cookieHeader);

  const cacheKey = `${method.toUpperCase()}::${url}::${JSON.stringify(body)}`;

  console.log(cacheKey);

  if (method.toUpperCase() === "GET" && cache[cacheKey]) {
    const { data, timestamp } = cache[cacheKey];
    if (Date.now() - timestamp < CACHE_TTL) {
      return res.json(data);
    } else {
      delete cache[cacheKey]; // Expired
    }
  }

  try {
    const axiosConfig = {
      url,
      method,
      headers: {
        ...headers,
        cookie: cookieHeader || ""   // forward cookies to target API
      },
      withCredentials: true
    };

    if (method !== "GET" && body && Object.keys(body).length > 0) {
      axiosConfig.data = body;
    }

    // if (params && Object.keys(params).length > 0) {
    //   axiosConfig.params = params;
    // }

    const response = await axios(axiosConfig);

    if (method.toUpperCase() === 'GET') {
      cache[cacheKey] = {
        data: {
          status: response.status,
          headers: response.headers,
          data: response.data,
        },

      timestamp: Date.now()
      }
    }

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }
    
    res.json({
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
  } catch (err) {
    res.json({
      status: err.response?.status || 500,
      data: err.response?.data || err.message,
    });
  }
});


app.listen(5000, () => {
  console.log("sever listen at port 5000");
})