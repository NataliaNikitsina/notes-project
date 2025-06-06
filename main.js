const model = {
    notes: [],

    isShowOnlyFavorite: false,

    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
    },

    updateNotesView() {
        if (this.isShowOnlyFavorite) {
            const notesToRender = this.notes.filter(note => note.isLove);
            view.renderNotes(notesToRender);
        } else {
            view.renderNotes(this.notes);
        }
    },

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
        this.updateNotesView();
        view.getMessage('Заметка добавлена', 'good-message');
        setTimeout(view.hideMessage, 3000,'good-message')
    },

    changeStatus(changedId) {
        this.notes = this.notes.map(note => {
            if (note.id === changedId) {
                note.isLove = !note.isLove
            }
            return note;
        })
        this.updateNotesView();
    },

    deleteNote(deleteId) {
        this.notes = this.notes.filter(note => note.id !== deleteId);
        view.getMessage('Заметка удалена', 'good-message');
        this.updateNotesView();
        setTimeout(view.hideMessage, 3000, 'good-message')
    },
}

const view = {

    renderNotes(notes) {
        const notesList = document.querySelector('.notes-list');
        let notesHTML = '';

        if (notes.length === 0 && !model.isShowOnlyFavorite) {
            notesHTML = '<li class="empty-field">У вас нет еще ни одной заметки <br> Заполните поля выше и создайте свою первую заметку!</li>'
        } else if (notes.length === 0 && model.isShowOnlyFavorite) {
            notesHTML = '<li class="empty-field">У вас нет избранных заметок</li>'
        } else {
            notes.forEach((note) => {
                notesHTML += `<li class="note"><div class="title ${note.backgroundColor}"><p>${note.title}</p><div id="${note.id}"><input type="image" src=${note.isLove ? "./assets/images/heart-active.svg" : "./assets/images/heart-inactive.svg"} alt="Heart" width="16" height="16" class="heart"><input type="image" src="./assets/images/trash.svg" alt="Wastebasket" width="16" height="16" class="deleted"></div></div><p class="note-text">${note.description}</p></li>`;
            })
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
                this.writeEmptyInput()
            } else if (noteTitle.length > 50) {
                this.reduceLengthTitle()
            } else if (noteDescription.length > 200) {
                this.reduceLengthDescription()
            } else {
                controller.addNote(noteTitle, noteDescription, selectedColor);
                document.querySelector('.add-title').value = '';
                document.querySelector('.add-description').value = '';
            }
        })

        const loveCheckbox = document.querySelector('.love-input');
        loveCheckbox.addEventListener('change', () => {
            controller.toggleShowOnlyFavorite()
            controller.updateNotesView();
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
        const message = document.getElementById('message');
        message.textContent = text;
        message.classList.remove('message')
        message.classList.add(textClass)
    },

    hideMessage(textClass) {
        const message = document.getElementById('message');
        message.textContent = '';
        message.classList.remove(textClass);
        message.classList.add('message');
    },

    writeEmptyInput() {
        this.getMessage('Заполните все поля', 'warning');
        setTimeout(this.hideMessage, 3000, 'warning')
    },

    reduceLengthTitle() {
        this.getMessage('Максимальная длина заголовка - 50 символов', 'warning');
        setTimeout(this.hideMessage, 3000, 'warning')
    },

    reduceLengthDescription() {
        this.getMessage('Максимальная длина заметки - 200 символов', 'warning');
        setTimeout(this.hideMessage, 3000, 'warning')
    },
}

const controller = {
    countNotes() {
        return (model.countNotes()).toString();
    },

    addNote(noteTitle, noteDescription, selectedColor) {
        model.addNote(noteTitle, noteDescription, selectedColor);
    },

    toggleShowOnlyFavorite() {
        model.toggleShowOnlyFavorite()
    },

    updateNotesView() {
        model.updateNotesView();
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