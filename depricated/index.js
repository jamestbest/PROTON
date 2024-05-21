async function search_users() {
    let username = document.getElementById("usersearch")?.value

    if (!username) {
        await search_users_failed("Search field cannot be empty")
        return;
    }

    fetch(`api/user/search/${username}`)
      .then((data) => data.json())
      .then((json) => {
        let users = json.users
        let res_elem = document.getElementById("usersearch_result")

        if (!res_elem) {
            console.error("CANNOT FIND usersearch_result element")
            return;
        }

        if (users.length === 0) {
            res_elem.innerHTML = "<h3>No users found</h3>"
            return;
        }

        let list = '<ul>'
        users.forEach((user) => {
            list += `<li>${user.username} : ${user.gr_id}</li>`
        })
        list += '</ul>'

        res_elem.innerHTML = list
      }).catch((err) => {
        console.error("ERROR fetching users", err)
      })
}

async function search_users_failed(message) {
    let res_div = document.getElementById("usersearch_result")

    res_div.innerText = message
}