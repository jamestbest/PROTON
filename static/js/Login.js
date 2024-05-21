import {change_to_index, change_page} from "./shared.js";

document.getElementById("mainRequest").addEventListener("click", function() {
    change_to_index()
})

document.getElementById("loginRequest").addEventListener("click", async function() {
    await attempt_login_and_redirect();
})

document.getElementById("registerRequest").addEventListener("click", function() {
    change_page('Register.html')
})

// todo change these to use the api actions
async function attempt_login() {
    const username = document.getElementById("uname");
    const password = document.getElementById("password");

    console.log(`Username: ${username.value}`);
    console.log(`Password: ${password.value}`);

    if (username.value.length === 0 || password.value.length === 0) {
        return {errCode: 422}
    }

    const u_val = username.value;
    const p_val = password.value;

    password.value = "";

    return await fetch('/spin/login', {
        method: "POST",
        body: JSON.stringify({username: u_val, password: p_val}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log("RESPONSE::", response)
        if (response.ok) {
            return {errCode: 200, result: response.json()};
        }
        else {
            return {errCode: response.status};
        }
    }).catch((err) => {throw err})
}

async function attempt_login_and_redirect() {
    attempt_login().then((result) => {
        switch (result.errCode) {
            case 200:
                console.log("CHANGING");
                const params = new URLSearchParams(window.location.search);
                let redirect = params.get('redirect');

                if (!redirect) {
                    change_to_index()
                    return;
                }

                change_page(redirect)
                return
            case 401:
                document.getElementById("response").innerHTML = "<h2>Invalid credentials</h2>";
                return;
            case 404:
                document.getElementById("response").innerHTML = "<h2>Username not found</h2>"
                return;
            case 422:
                document.getElementById("response").innerHTML = "<h2>Username or password is empty</h2>"
                return;
        }
    }).catch((err) => {
        console.log(err)
        document.getElementById("response").innerHTML = "<h2>Failed to login</h2>"
    });
}

window.onload = async function() {

}