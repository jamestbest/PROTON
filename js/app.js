console.log("Hail the almighty JS")

function change_path(path) {
  window.location.href = window.location.protocol + "//" + window.location.host + path
}

function change_page(page) {
  window.location.href = page;
}

function change_page_redirect_back(page, redirect_page) {
  window.location.href = `${page}?redirect=${redirect_page}`
}

function change_page_redirect_here(page) {
  window.location.href = `${page}?redirect=${window.location.pathname}`
}

function login_redirect() {
  change_page_redirect_here("Login.html")
}

async function GetGoodreadsFromId() {
  const gr_id = document.getElementById("grid").value;

  if (!gr_id) {
    document.getElementById("grid_result").innerHTML = "<h4>Empty gr_id not allowed</h4>";
    return
  }

  fetch(`/api/user/${gr_id}`).then(response => response.json())
      .then((books) => {
    console.log(books)
    document.getElementById("grid_result").innerHTML = books.data
  }).catch((err) => {
    console.log(err)
  })

  // fetch(`/api/user/${gr_id}`).then((response) => {
  //
  // }).catch((error) => {
  //   document.getElementById("grid_result").innerHTML = `<h4>Error: ${error}</h4>`
  // })
}

async function GetGoodreads() {
  fetch('/api/gr').then(
    response => {
      console.log(response);
      return response.json();
    }
  ).then(data => {
      console.log("Data: ", data)

    let reviews = data.reviews;
    let average = data.average
    let median = data.median

    reviews.sort(function(a,b) {
      return b.user_rating - a.user_rating;
    });
    let list = `average rating = ${average.toFixed(2)}<br>\
                       median rating: ${median}<br>\
                       <ul>`;
    reviews.forEach((book) => {
      list += `<li>${book.title} ${book.user_rating}</li>`
    })
    list += "</ul>"

      document.getElementById("GoodReadsList").innerHTML = list
    }
  ).catch(error => console.log("Error: ", error))
}

function GetNASAImage() {
  fetch('/api/nasa').then(
    response => {
      console.log(response);
      return response.json();
    }
  ).then(data => {
      const imgElement = new Image();
      imgElement.src = data.image_url;
      document.body.appendChild(imgElement);
    }
  ).catch(error => console.log("Error: ", error))
}

async function attempt_session_login() {
  fetch('/spin/session', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => {
    const data = await res.json();
    const user = data || {username: "None", email: "Null"};

    document.getElementById("C_login").innerHTML = `Logged in as: ${user.username}`
    document.getElementById("login_button").innerHTML = "Logout"
  }).catch((err) => {
    console.log(err)
  })
}

async function attempt_login_and_redirect() {
  attempt_login().then((result) => {
    switch (result.errCode) {
      case 200:
        console.log("CHANGING");
        const params = new URLSearchParams(window.location.search);
        let redirect = params.get('redirect');

        if (!redirect) {
          redirect = 'index.html';
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
    }
  }).catch((err) => {
    console.log(err)
    document.getElementById("response").innerHTML = "<h2>Failed to login</h2>"
  });
}

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

async function register() {
  const username = document.getElementById("reguname")?.value;
  const password = document.getElementById("regpassword")?.value;
  const email = document.getElementById("regemail")?.value;

  if (!username || !password) {
    document.getElementById("regresponse").innerHTML = "<h1>Unable to process blank entry</h1>"
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
    if (res.status === 200) change_page("index.html")
    else document.getElementById("regresponse").innerHTML = (await res.json()).msg
  }).catch((err) => {
    console.log(err)
  })
}

async function logout() {
  fetch('/spin/logout').then((res) => {
    document.getElementById("login_button").innerHTML = "Login"
    document.getElementById("C_login").innerHTML = "Not logged in."
  }).catch((err) => {
    throw err;
  })
}

async function login_button_triggered() {
  if (document.getElementById("login_button").innerHTML === "Logout") {
    await logout().catch((err) => console.log(err));
  } else {
    change_page('Login.html');
  }
}

function get_cookie(name) {
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

function check_dims() {
  let cookie = get_cookie("dimsWarn");
  if (cookie != null && cookie==="true") {
    return;
  }

  if (screen.availWidth < 1000 || screen.availHeight < 600) {
    alert(`PROTON is not designed with low resolution/vertical screens in mind, for best viewing use 1920x1080`)
  }
  document.cookie = "dimsWarn=true"
}