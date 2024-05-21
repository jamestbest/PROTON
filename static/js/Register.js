import {change_to_index} from "./shared.js";

async function register() {
    const username = document.getElementById("reguname")?.value;
    const password = document.getElementById("regpassword")?.value;
    const email = document.getElementById("regemail")?.value;

    if (!username || !password) {
        document.getElementById("regresponse").innerHTML = "<h2>Unable to process blank entry</h2>"
        return
    }

    fetch('/spin/register', {
        method: "POST",
        body: JSON.stringify({username: username, password: password, email: email}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        console.log("RECIEVED REGISTER")
        console.log(res.body)
        if (res.status === 200) change_to_index()
        else document.getElementById("regresponse").innerText = (await res.json()).msg
    }).catch((err) => {
        console.log(err)
    })
}

document.getElementById("mainRequest")?.addEventListener("click", change_to_index)

document.getElementById("registerRequest").addEventListener("click", register)