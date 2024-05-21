import {change_page} from "./shared.js";

async function get_user_info() {
    fetch(`/charge/user/my_info`).then((user_data) => {
        return user_data;
    }).catch((err) => {
        console.log(err)
        throw err;
    })
}

async function load_my_home() {
    await get_user_info().catch(() => {
        console.log("CANNOT LOAD");
        change_page("Login.html")
    });
}