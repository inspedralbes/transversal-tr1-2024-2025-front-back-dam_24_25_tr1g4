import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

const URL = "http://localhost:" + import.meta.env.VITE_APP_PORT;

export const socket = io(URL);

socket.on("connect", () => {
    console.log("connected");
  state.connected = true;
});



  socket.on("conected", (msg) => {
    console.log(msg);
  });

socket.on("disconnect", () => {
  state.connected = false;
});

