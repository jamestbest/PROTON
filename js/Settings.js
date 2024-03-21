async function on_visit() {
    //fetch the user information

    fetch('/spin/session', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (response) => {
        switch (response.status) {
            case 401:
                login_redirect()
                return;
            case 200:
                let user = await response.json()

                document.getElementById("Username").innerHTML = `Username: ${user.username}`
                break;
        }
    }).catch((err) => {
        console.log(err)
        console.log("Error")
    })
}