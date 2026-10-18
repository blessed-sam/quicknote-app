const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];

function render(notesToDisplay = notes) {
  notesList.replaceChildren();

  notesToDisplay.forEach(function (note) {
    const listItem = document.createElement("li");
    listItem.classList.add("note-card");

    const categoryClass = `category-${note.category.toLowerCase()}`;
    listItem.classList.add(categoryClass);

    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;

    const noteDate = document.createElement("small");
    noteDate.classList.add("note-date");
    noteDate.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
      deleteNote(note.id);
    });

    listItem.appendChild(noteText);
    listItem.appendChild(categoryLabel);
    listItem.appendChild(noteDate);
    listItem.appendChild(deleteButton);

    notesList.appendChild(listItem);
  });

  updateNoteCount();
}

function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  const createdAt = new Date().toLocaleString();

  const note = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: createdAt,
  };

  notes.push(note);

  render();

  noteInput.value = "";
});

noteForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

   
    errorMessage.textContent = "";

  
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

 
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

   
    notes.push(note);

  
    render();


    noteInput.value = "";


    errorMessage.textContent = "";

});

function saveNotes() {

    localStorage.setItem("quicknotes", JSON.stringify(notes));

}


function loadNotes() {

    const savedNotes = localStorage.getItem("quicknotes");

    if (savedNotes !== null) {

        try {
            const parsedNotes = JSON.parse(savedNotes);

            if (Array.isArray(parsedNotes)) {
                notes = parsedNotes;
            } else {
                notes = [];
            }

        } catch (error) {
            notes = [];
            console.error("Could not load saved notes:", error);
        }

    }

}

searchInput.addEventListener("input", function () {

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {

        return note.text.toLowerCase().includes(searchTerm);

    });

    render(filteredNotes);

   
    if (searchTerm !== "" && filteredNotes.length === 0) {

        const message = document.createElement("li");

        message.textContent = "No notes match your search.";

        notesList.appendChild(message);

    }

});