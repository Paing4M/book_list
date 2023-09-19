// create a book class
class Book {
	constructor(title, author, isbn) {
		this.title = title
		this.author = author
		this.isbn = isbn
	}
}

// create a ui class
class Ui {
	static displayBookList() {
		const books = Store.getBook()
		books.forEach((book) => this.addBookToList(book))
	}

	static addBookToList(book) {
		const bookList = document.querySelector('#book-list')
		const row = document.createElement('tr')
		row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a class='btn btn-danger delete btn-sm'>x</a></td>
                  `
		bookList.appendChild(row)
	}

	static removeBook(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove()
			this.showAlert('Book deleted successfully.', 'success')
		}
	}

	static clearFileds() {
		document.getElementById('title').value = ''
		document.getElementById('author').value = ''
		document.getElementById('isbn').value = ''
	}

	static showAlert(message, status) {
		let p = document.createElement('p')
		p.classList = `alert alert-${status}`
		p.textContent = message
		document.querySelector('.alertBox').appendChild(p)

		setTimeout(() => document.querySelector('.alert').remove(), 2000)
	}
}

// localStorage class
class Store {
	static getBook() {
		let books

		if (localStorage.getItem('books') === null) {
			books = []
		} else {
			books = JSON.parse(localStorage.getItem('books'))
		}

		return books
	}

	static storeBook(book) {
		const books = this.getBook()
		books.push(book)
		localStorage.setItem('books', JSON.stringify(books))
	}

	static deleteBook(isbn) {
		const books = this.getBook()
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1)
			}
		})
		localStorage.setItem('books', JSON.stringify(books))
	}
}

// display in UI
window.addEventListener('DOMContentLoaded', () => Ui.displayBookList())

// remove book
document.querySelector('#book-list').addEventListener('click', (e) => {
	const isbn = e.target.parentElement.previousElementSibling.textContent
	Ui.removeBook(e.target)
	Store.deleteBook(isbn)
})

// add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
	e.preventDefault()
	let title = document.getElementById('title').value
	let author = document.getElementById('author').value
	let isbn = document.getElementById('isbn').value

	if (title == '' || author == '' || isbn == '') {
		Ui.showAlert('Please fill the all input fields.', 'danger')
	} else {
		const book = new Book(title, author, isbn)
		Ui.addBookToList(book)
		Store.storeBook(book)
		Ui.showAlert('Book added successfully.', 'success')
		Ui.clearFileds()
	}
})
