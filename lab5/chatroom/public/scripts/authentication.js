const Authentication = (function () {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function () {
        return user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const Authentication = (function () {
        // Closure variable to store the signed-in user
        let user = null;

        const signin = function (username, password, onSuccess, onError) {
            //
            // A. Preparing the user data
            //
            const data = {
                username: username,
                password: password
            };

            //
            // B. Sending the AJAX request to the server
            //
            fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                //
                // F. Processing any error returned by the server
                //
                .then((res) => res.json())
                .then((json) => {
                    if (json.status === "success") {
                        // Store the returned user in the closure variable
                        user = json.user;

                        // Run the onSuccess() callback
                        if (onSuccess) onSuccess();
                    } else if (onError) {
                        onError(json.error);
                    }
                })
                .catch((err) => {
                    // Handle network or other errors and pass them to the onError callback
                    const errorMessage = "Network error or other issue occurred.";
                    if (onError) onError(errorMessage);

                    // Print the error to the console
                    console.error(errorMessage);
                });
        };
        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
        return {signin};
    })();

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function (onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            //
            // C. Processing any error returned by the server
            //
            .then((res) => res.json())
            .then((json) => {
                if (json.status === "success") {
                    // E. Handling the success response from the server
                    user = json.user; // Update the signed-in user

                    // If validation is successful, call the onSuccess() callback
                    if (onSuccess) onSuccess();
                } else if (onError) {
                    onError(json.error);
                }
            })
            .catch((err) => {
                // Handle network or other errors and pass them to the onError callback
                const errorMessage = "Network error or other issue occurred.";
                if (onError) onError(errorMessage);

                // Print the error to the console
                console.error(errorMessage);
            });
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function (onSuccess, onError) {
// Sending the AJAX request to the server
        fetch("/signout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            // Process the response
            .then((res) => res.json())
            .then((json) => {
                if (json.status === "success") {
                    // Sign-out is successful, set the user to null
                    user = null;

                    // If sign-out is successful, call the onSuccess() callback
                    if (onSuccess) onSuccess();
                } else if (onError) {
                    onError(json.error);
                }
            })
            .catch((err) => {
                // Handle network or other errors and pass them to the onError callback
                const errorMessage = "Network error or other issue occurred.";
                if (onError) onError(errorMessage);

                // Print the error to the console
                console.error(errorMessage);
            });
    };

    return {getUser, signin, validate, signout};
})();
