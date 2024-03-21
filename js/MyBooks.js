async function update_gr() {
    fetch('/api/gr/update').then(async (res) => {

        if (res.status !== axios.HttpStatusCode.Ok) {
            switch (res.status) {
                case axios.HttpStatusCode.Forbidden:
                    login_redirect()
                    break;
                default:
                    document.body.append(`<h2>${err}</h2>`)
                    break;
            }
            return;
        }

        console.log("IN BOOKS")
        const books = await res.json()
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

        list += "Unique Books: <ul>"

        document.getElementById("books").innerHTML = list
    }).catch((err) => {
        console.log(err)
    })
}