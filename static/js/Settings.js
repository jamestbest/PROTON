import {change_to_index, login_redirect} from "./shared.js";

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

                document.getElementById("Username").innerText = `Username: ${user.username}`

                document.getElementById("currentgr_id").innerText = `gr_id: ${user.gr_id}`
                break;
        }
    }).catch((err) => {
        console.log(err)
        console.log("Error")
    })
}

async function link_gr() {
    const grid = document.getElementById("linkgr")?.value
    const response = document.getElementById("grid_link_results")
    response.innerText = ""

    if (!grid) {
        response.innerText = "Invalid goodreads id inputted"
        return
    }

    fetch('/api/link_gr', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({gr_id: grid}),
    })
        .then(async (res) => {
            if (res.ok) return res.json()

            const data = await res.json()
            throw new Error(data.error)
        })
        .then((data) => {
            document.getElementById("currentgr_id").innerText = `gr_id: ${data.data}`
            document.getElementById("linkgr").value = ""
            response.innerText = "Successfully linked goodreads id. Use MyBooks to view books linked to id"
        }) // message & gr_id
        .catch((err) => console.log(err))
}

window.onload = async function() {
    await on_visit()
}

document.getElementById("mainRequest").addEventListener("click", function() {
    change_to_index()
})

document.getElementById("linkGRRequest").addEventListener("click", async function() {
    await link_gr()
})
