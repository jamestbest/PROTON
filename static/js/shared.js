export function get_cookie(name) {
    let spl = document.cookie.split(";")

    for (let cookie of spl) {
        let parts = cookie.split("=");
        let cname = parts[0];

        if (cname === name) {
            return parts[1];
        }
    }

    return null;
}

export function change_path(path) {
    window.location.href = window.location.protocol + "//" + window.location.host + path
}

export function change_to_resource(full_path) {
    window.location.href = full_path
}

export function change_to_index() {
    window.location.href = '/'
}

export function change_page(page) {
    window.location.href = `/static/html/${page}`
}

export function change_page_redirect_back(page, redirect_page) {
    window.location.href = `/static/html/${page}?redirect=${redirect_page}`
}

export function change_page_redirect_here(page) {
    window.location.href = `/static/html/${page}?redirect=${window.location.pathname.split('/').pop()}`
}

export function login_redirect() {
    change_page_redirect_here("Login.html")
}
