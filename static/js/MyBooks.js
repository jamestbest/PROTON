import {change_to_index, login_redirect} from "./shared.js";
import {get_goodreads_from_id, is_logged_in} from "./API_actions.js"

async function update_gr() {
    let user;
    try {
        user = await is_logged_in()
    } catch (err) {
        user.successful = false
    }

    if (!user.successful) {
        login_redirect()
    }

    let books;
    try {
        books = await get_goodreads_from_id(user.data.gr_id)
    } catch (err) {
        document.getElementById("books").innerHTML = "Error"
        return;
    }

    let list = `Books found (${books.foundBooks.length}): <br><ul>`
    console.log(books.foundBooks)
    for (let book of books.foundBooks) {
        list += `<li>${book.title} by ${book.author}</li>`
    }

    list += `</ul>\n\n\nBooks Added (${books.addedBooks.length}): <br><ul>`
    for (let book of books.addedBooks) {
        list += `<li>${book.title} by ${book.author}</li>`
    }
    list += "</ul>"

    list += "Unique Books: <ul></ul>"

    document.getElementById("books").innerHTML = list
}

document.getElementById("mainRequest").addEventListener("click", function() {
    change_to_index()
})

window.onload = async function() {
    await update_gr()
}