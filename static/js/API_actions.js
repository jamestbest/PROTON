export async function attempt_login(username, password) {
    return await fetch('/spin/login', {
        method: "POST",
        body: JSON.stringify({username: username, password: password}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return {errCode: 200, result: response.json()};
        }
        else {
            return {errCode: response.status};
        }
    }).catch((err) => {throw err})
}

export async function is_logged_in() {
    return fetch('/spin/session', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        return {successful: res.ok, data: res.ok ? await res.json() : null}
    }).catch((err) => {throw err})
}

export async function logout() {
    return fetch('/spin/logout')
      .then((res) => {
          return res.ok
      })
      .catch(() => {
          return false
      })
}

export async function register(username, password, email) {
    return fetch('/spin/register', {
        method: "POST",
        body: JSON.stringify({username: username, password: password, email: email}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then((res) => {
          if (res.ok) return res.json()
          else throw new Error(res.body.toString())
      })
      .then((user) => {
          return user;
      })
      .catch((err) => {throw err})
}

export async function get_goodreads_data() {
    return fetch('/charge/local_gr')
      .then((res) => res.json())
      .then((data) => {
          return data
      })
      .catch((err) => {throw err})
}

export async function get_nasa_image() {
    return fetch('/charge/nasa/apod')
        .then((res) => res.json())
        .then((json) => {
            return json.data
        })
        .catch((err) => {throw err})
}

export async function set_gr_id(gr_id) {
    return fetch('/charge/user/link_gr')
        .then(async (res) => {
            if (res.ok) return res.json()

            const data = await res.json()
            throw new Error(data.error)
        })
        .then((data) => {return data}) // message & gr_id
        .catch((err) => {throw err})
}

export async function get_user_books(userId) {
    // not impl
}

export async function get_my_info() {
    return fetch('/charge/user/my_info')
        .then(async (res) => {
            if (res.ok) return res.json();

            const data = await res.json()
            throw new Error(data.error)
        })
        .then((data) => {return data})
        .catch((err) => {throw err})
}

export async function search_for_users(username) {
    return fetch(`/charge/user/search/${username}`)
        .then(async (res) => {
            if (res.ok) return res.json()

            const data = await res.json()
            throw new Error(data.error)
        })
        .then((json) => {
            return json.data
        }).catch((err) => {
            throw err
        })
}

export async function get_goodreads_from_id(gr_id) {
    return fetch(`/charge/gr/${gr_id}`)
        .then(async res => {
            if (res.ok) return res.json()

            const data = await res.json()
            throw new Error(data.error)
        })
        .then((json) => {
            return json.data
        }).catch((err) => {throw err})
}