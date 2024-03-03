async function update_gr() {
    fetch('/api/gr/update').then(async (res) => {
        console.log("IN BOOKS")
        let list = "Books found: <br><ul>"
        const books = await res.json()
        console.log(books.foundBooks)
        for (let book of books.foundBooks) {
            list += `<li>${book.title} by ${book.author}</li>`
        }

        list += "</ul>\n\n\nBooks Added: <br><ul>"
        for (let book of books.addedBooks) {
            list += `<li>${book.title} by ${book.author}</li>`
        }
        list += "</ul>"

        document.getElementById("books").innerHTML = list
    }).catch((err) => {
        document.body.append(`<h2>${err}</h2>`)
    })
}