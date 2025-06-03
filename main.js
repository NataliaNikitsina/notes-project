const model = {
    notes: [],

    countNotes() {
        return this.notes.length ? this.notes.length : 0;
    },

    addNote(noteTitle, noteDescription, selectedColor) {
        const newNote = {
            id: new Date().getTime(),
            isLove: false,
            backgroundColor: selectedColor,
            title: noteTitle,
            description: noteDescription,
        }
        this.notes.unshift(newNote);
        view.renderNotes(this.notes);

        view.getMessage('Заметка добавлена', 'good-message');

        setTimeout(view.hideMessage, 3000)
    },

    changeStatus(changedId) {
        this.notes = this.notes.map(note => {
            if (note.id === changedId) {
                note.isLove = !note.isLove
            }
            return note;
        })
        view.renderNotes(this.notes);
    },

    chooseLoveNotes() {
        const newNotes = this.notes.filter(note => note.isLove);
        view.renderNotes(newNotes);
    },

    deleteNote(deleteId) {
        this.notes = this.notes.filter(note => note.id !== deleteId);
        view.renderNotes(this.notes);
        view.getMessage('Заметка удалена', 'good-message');
        setTimeout(view.hideMessage, 3000)
    },
}

const view = {

    renderNotes(notes) {
        const notesList = document.querySelector('.notes-list');
        let notesHTML = '';

        const loveCheckbox = document.querySelector('.love-filter');

        if (notes.length === 0) {
            notesHTML = '<li class="empty-field">У вас нет еще ни одной заметки <br> Заполните поля выше и создайте свою первую заметку!</li>'
            const loveCheckbox = document.querySelector('.love-filter');
            loveCheckbox.style.display = 'none';
        } else {
            notes.forEach((note) => {
                notesHTML += `<li class="note"><div class="title ${note.backgroundColor}"><p>${note.title}</p><div id="${note.id}"><input type="image" src=${note.isLove ? "./assets/images/heart-active.svg" : "./assets/images/heart-inactive.svg"} alt="Heart" width="16" height="16" class="heart"><input type="image" src="./assets/images/trash.svg" alt="Wastebasket" width="16" height="16" class="deleted"></div></div><p class="note-text">${note.description}</p></li>`;
            })
            loveCheckbox.style.display = 'block';
        }

        notesList.innerHTML = notesHTML;

        const amountOfNotes = document.querySelector('.number-notes');
        amountOfNotes.textContent = controller.countNotes();
    },

    init() {
        this.renderNotes(model.notes);

        let selectedColor = 'yellow';

        const radioList = document.querySelector('.radio-list');
        radioList.addEventListener('change', (event) => {
            selectedColor = event.target.value;
        })

        const mainForm = document.querySelector('.notes-form');
        mainForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const noteTitle = document.querySelector('.add-title').value;
            const noteDescription = document.querySelector('.add-description').value;

            if (noteTitle.trim() === '' || noteDescription.trim() === '') {
                view.writeEmptyInput()
            } else if (noteTitle.length > 50) {
                view.reduceLengthTitle()
            } else {
                controller.addNote(noteTitle, noteDescription, selectedColor);
                document.querySelector('.add-title').value = '';
                document.querySelector('.add-description').value = '';
            }
        })

        const loveCheckbox = document.querySelector('.love-input');
        loveCheckbox.addEventListener('change', () => {
            if (loveCheckbox.checked) {
                controller.chooseLoveNotes()
            } else this.renderNotes(model.notes);
        })


        const notesList = document.querySelector('.notes-list');

        notesList.addEventListener('click', (event) => {
            if (event.target.classList.contains('deleted')) {
                const deleteId = +event.target.parentElement.id;
                controller.deleteNote(deleteId)
            }

            if (event.target.classList.contains('heart')) {
                const changedId = +event.target.parentElement.id
                controller.changeStatus(changedId)
            }
        })

    },

    getMessage(text, textClass) {
        const message = document.querySelector('.message');
        message.textContent = text;
        message.classList.add(textClass)
    },

    hideMessage() {
        const message = document.querySelector('.message');
        message.textContent = '';
        message.classList.remove('warning')
        message.classList.remove('good-message')
    },

    writeEmptyInput() {
        this.getMessage('Заполните все поля', 'warning');
        setTimeout(this.hideMessage, 3000)
    },

    reduceLengthTitle() {
        this.getMessage('Максимальная длина заголовка - 50 символов', 'warning');
        setTimeout(this.hideMessage, 3000)
    },
}

const controller = {
    countNotes() {
        return (model.countNotes()).toString();
    },

    addNote(noteTitle, noteDescription, selectedColor) {
        model.addNote(noteTitle, noteDescription, selectedColor);
    },

    chooseLoveNotes() {
        model.chooseLoveNotes();
    },

    deleteNote(deleteId) {
        model.deleteNote(deleteId)
    },

    changeStatus(changedId) {
        model.changeStatus(changedId)
    },
}

function init() {
    view.init()
}

init()