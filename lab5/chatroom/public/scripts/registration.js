const Registration = (function () {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `avatar`    - The avatar of the user
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function (username, avatar, name, password, onSuccess, onError) {
        // A. Preparing the user data
        const data = {
            username: username,
            avatar: avatar,
            name: name,
            password: password
        };
        const dataString = JSON.stringify(data);

        // B. Sending the AJAX request to the server
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataString
        })
            .then((res) => res.json())
            .then((json) => {
                // Check the response status
                if (json.status === "error") {
                    // F. Processing any error returned by the server
                    // If the response is an error, call the onError callback and pass the error message from the server
                    if (onError) onError(json.error);
                } else {
                    // J. Handling the success response from the server
                    // If the response is successful, call the onSuccess callback (if provided)
                    if (onSuccess) onSuccess();
                }
            })
            .catch((err) => {
                // Handle network or other errors and pass them to the onError callback
                // F. Processing any error returned by the server
                const errorMessage = "Network error or other issue occurred.";
                if (onError) onError(errorMessage);

                // Print the error to the console
                console.error(errorMessage);
            });
    };

    return {register};
})();
