import {
    get_goodreads_data,
    get_goodreads_from_id,
    get_nasa_image,
    is_logged_in,
    search_for_users,
    logout
} from "./API_actions.js";
import {get_cookie, change_page, change_to_resource} from "./shared.js"

document.getElementById("SettingsDirect").addEventListener("click", function() {
    change_page("Settings.html")
})

document.getElementById("GoodreadsListRequest").addEventListener("click", async function() {
    await get_my_goodreads();
})

document.getElementById("MyBooksDirect").addEventListener("click", function() {
    change_page("MyBooks.html")
})

document.getElementById("InformationDirect").addEventListener("click", function() {
    change_page("Information.html")
})

document.getElementById("BannerDirect").addEventListener("click", function() {
    change_to_resource("/static/images/Banner.svg")
})

document.getElementById("NasaRequest").addEventListener("click",  function() {
    GetNASAImage()
})

document.getElementById("userSearchRequest").addEventListener("click", async function() {
    await search_users()
})

document.getElementById("goodreadsBooksRequest").addEventListener("click", async function() {
    await get_goodreads()
})

document.getElementById("LoginDirect").addEventListener("click", async function() {
    is_logged_in().then(async function (data) {
        if (data.successful) {
            await logout().then(async (successful) => {
                if (successful) {
                    await update_logged_in_text()
                }
            }).catch((err) => console.log(err));
        } else {
            throw new Error('Not logged in');
        }
    }).catch(() => {
        change_page('Login.html');
    })
})

const loginDetailsText = document.getElementById("C_login")
const loginButton = document.getElementById("LoginDirect")

async function update_logged_in_text() {
     await is_logged_in().then((json) => {
         loginDetailsText.innerText = json.successful ? `Logged in as: ${json.data.username}` : `Not logged in`
         loginButton.innerText = json.successful ? "Logout" : "Login"
     }).catch((err) => {
         loginDetailsText.innerText = `Not logged in`
         loginButton.innerText = "Login"
         throw err
     })
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

const NasaImagesDiv = document.getElementById("NasaImages");
const NasaResponse = document.getElementById("NasaResponse")

function GetNASAImage() {
    NasaResponse.innerText = "Sending request"
    get_nasa_image().then((url) => {
        const newImage = new Image()
        newImage.src = url
        NasaImagesDiv.appendChild(newImage)
        NasaResponse.innerText = "Received image"
    }).catch((err) => {
        console.log(err)
        NasaResponse.innerText = "Did not receive a response from the NASA API"
    })
}

const userSearchResults = document.getElementById("usersearch_result")
const userSearchField = document.getElementById("usersearch")

async function search_users() {
    let username = userSearchField?.value

    if (!username) {
        await search_users_failed("Search field cannot be empty")
        return;
    }

    search_for_users(username).then((users) => {
        if (users.length === 0) {
            userSearchResults.innerHTML = "<h3>No users found</h3>"
            return;
        }

        let list = '<ul>'
        users.forEach((user) => {
            list += `<li>${user.username} : ${user.gr_id}</li>`
        })
        list += '</ul>'

        userSearchResults.innerHTML = list
    }).catch((err) => {
        console.log(err)
        userSearchResults.innerText = "Error fetching API response from Goodreads"
    })
}

const goodreadsIdField = document.getElementById("grid")
const goodreadsResult = document.getElementById("grid_result")

async function get_goodreads() {
    let gr_id = goodreadsIdField?.value

    if (!gr_id) {
        goodreadsResult.innerHTML = "<h3>Empty gr_id not allowed</h3>";
        return
    }

    get_goodreads_from_id(gr_id).then((data) => {
        const foundBooks = data.foundBooks
        const addedBooks = data.addedBooks
        const allBooks = foundBooks.concat(addedBooks)
        const goodreads_search_div = document.getElementById("grid_results")
        format_goodreads_data(allBooks, goodreads_search_div)
        goodreadsResult.innerHTML = data
    }).catch((err) => {
        console.log(err)
        goodreadsResult.innerText = "Error while fetching the goodreads data"
    })
}

// todo this is temp!
function create_my_book_box(book) {
    const div = document.createElement("div")

    div.className = "bookBox"

    const information = document.createElement("span")
    const img = document.createElement("img")

    img.className = "boxImg"

    img.src = book.book_image_url
    img.alt = `Image of ${book.title}`

    const date = new Date(Date.parse(book.pubDate))

    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset*60*1000))
    const formattedDate = localDate.toISOString().split('T')[0]


    information.innerText = `Title: ${book.title}
    author: ${book.author_name}
    publication: ${formattedDate}
    rating: ${book.user_rating}
    `

    div.appendChild(img)
    div.appendChild(information)

    return div
}

function create_book_box(book) {
    const div = document.createElement("div")

    div.className = "bookBox"

    const information = document.createElement("span")
    const img = document.createElement("img")

    img.className = "boxImg"

    img.src = book.image_url
    img.alt = `Image of ${book.title}`

    const date = new Date(Date.parse(book.pub_date))

    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset*60*1000))
    const formattedDate = localDate.toISOString().split('T')[0]

    information.innerText = `Title: ${book.title}
    author: ${book.author}
    publication: ${formattedDate}
    `

    div.appendChild(img)
    div.appendChild(information)

    return div
}

async function format_goodreads_data(books, result_div) {
    result_div.innerHTML = ""

    for (const book of books) {
        result_div.appendChild(create_book_box(book))
    }
}

async function get_my_goodreads() {
    get_goodreads_data().then((data) => {
        console.log("Data: ", data)

        let reviews = data.reviews;
        let average = data.average
        let median = data.median

        reviews.sort(function(a,b) {
            return b.user_rating - a.user_rating;
        });

        const results = document.getElementById("GoodReadsList")
        results.innerHTML = ""

        for (const book of reviews) {
            results.appendChild(create_my_book_box(book))
        }
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

window.onload = async function() {
    await update_logged_in_text().catch((err) => {console.log(err)})

    check_dims()
}