//

async function get_user_info() {
    fetch(`/api/my_info`).then((user_data) => {
        return user_data;
    }).catch((err) => {
        console.log(err)
        throw err;
    })
}

async function load_my_home() {
    let user_data = await get_user_info().catch((err) => {
        console.log("CANNOT LOAD");
        change_page("Login.html")
        return;
    });

    user_data
}