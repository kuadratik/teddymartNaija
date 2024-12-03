import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios
                    .post(
                        "/api/broadcasting/auth",
                        {
                            socket_id: socketId,
                            channel_name: channel.name,
                        },
                        {
                            headers: {
                                Authorization: `Bearer 6|uAXScQ6ID88sSNzbmSK8qb04NZF3bmAbK1DRhIcGcd5e6ae5`, // Replace `yourToken` with your actual token
                            },
                        }
                    )
                    .then((response) => {
                        console.log("success:" + response.data);
                        callback(false, response.data);
                    })
                    .catch((error) => {
                        console.log("error:" + error);
                        callback(true, error);
                    });
            },
        };
    },
});

window.Echo.private("App.Models.User.1001").listen("GotMessage", (event) => {
    console.log(event);
});
