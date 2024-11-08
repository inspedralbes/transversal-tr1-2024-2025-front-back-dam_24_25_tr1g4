import { reactive } from "vue";
import { io } from "socket.io-client";



// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

const URL = "http://localhost:3001";

export const socket = io(URL);

// socket.on("connect", () => {
//     console.log("connected");
// });



//   socket.on("conected", (msg) => {
//     console.log(msg);
//   });


