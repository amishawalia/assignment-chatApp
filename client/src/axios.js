import axios from "axios";

axios.create({
  baseURL: "http://localhost:5000/",
});

export default axios;
