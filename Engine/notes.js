// Purpose: To handle the notes page
//Import the models.js file from the Database folder
const path = require('path');
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');
const {Subjects,Notes}= require(modelsPath);
const fs=require('fs');//To read and write files
//To toggle the display of the projects
function toggleNotes() {
    //Get the projects container
    let notesSection = document.getElementsByClassName('notes')[0];
    //Check if the projects container is hidden
    if (notesSection.style.display === 'none' || notesSection.style.display === '') {
        //If the projects container is hidden, show it
        notesSection.style.display = 'block';
        //load the subjects
        loadSubjects();
    } else {
        //If the projects container is shown, hide it
        notesSection.style.display = 'none';
    }
}

function toggleSubjectForm() {
    //Get the project form
    let subjectForm = document.getElementById('subjectForm');
    //Check if the project form is hidden
    if (subjectForm.style.display === 'none' || subjectForm.style.display === '') {
        //If the project form is hidden, show it
        subjectForm.style.display = 'block';
    } else {
        //If the project form is shown, hide it
        subjectForm.style.display = 'none';
    }
}

//To save a subject to the database
function saveSubject() {
    //Get the subject form
    let subjectForm = document.getElementById('subjectForm');
    //Get the subject name
    let subjectName = subjectForm.querySelector('#subjectName').value;
    //Get the subject description
    let subjectDescription = subjectForm.querySelector('#subjectDescription').value;
    //Get the workspaceID
    let workspaceID = document.getElementById('workspaceID').value;
    //Create a new subject object
    let subject = {
        name: subjectName,
        description: subjectDescription,
        workspaceID: workspaceID
    };
    //Use the sequelize create function to save the subject to the database
    Subjects.create(subject);
    //Hide the subject form
    toggleSubjectForm();
    //Clear the subject form
    clearSubjectForm();
    //Load the subjects
    loadSubjects();
}

function clearSubjectForm() {
    //Clear the subject name
    document.getElementById('subjectName').value = '';
    //Clear the subject description
    document.getElementById('subjectDescription').value = '';
}

//function to load the subjects
async function loadSubjects() {
    let subjectsArray = [];
    //Get the workspaceID
    let workspaceID = document.getElementById('workspaceID').value;
    //Find all the subjects in the database
    Subjects.findAll({
        where: {
            workspaceID: workspaceID
        }
    }).then((subjects) => {
        //Get the subjects container
        let subjectsContainer = document.getElementById('subjectsList');
        //Clear the subjects container
        subjectsContainer.innerHTML = '';
        //Loop through the subjects
        subjects.forEach((subject) => {
            //Create a new subject element
            let subjectElement = createSubjectDiv(subject);
            //Append the subject element to the subjects container
            subjectsContainer.appendChild(subjectElement);
            subjectsArray.push(subject.dataValues);
        });
    }).then(()=>{
        //Fill the subjects with the books
        subjectsArray.forEach((subject)=>{
            fillSubject(subject.subjectID);
        });
    });
}

//Function to dynamically create the subjects div
function createSubjectDiv(subject){
    subject=subject.dataValues;//Get the subject data values
    //Create the shelf div
    let shelf=document.createElement('div');
    shelf.id="shelf"+subject.subjectID;//Set the id of the shelf
    shelf.className='shelf';
    //Put the subject id in the shelf
    shelf.setAttribute('value',subject.subjectID);
    //create the shelf-header div
    let shelfHeader=document.createElement('div');
    shelfHeader.className='shelf-header';
    //create the shelf-label div
    let shelfLabel=document.createElement('div');
    shelfLabel.className='shelf-label';
    shelfLabel.textContent=subject.name;
    //Put the shelf label in the shelf header
    shelfHeader.appendChild(shelfLabel);
    //Put the shelf header in the shelf
    shelf.appendChild(shelfHeader);
    //Create the shelf actions div
    let shelfActions=document.createElement('div');
    shelfActions.className='shelf-actions';
    //Create the edit button
    let editButton=document.createElement('button');
    editButton.className='shelf-edit-btn';
    //Create the edit icon
    let editIcon=document.createElement('img');
    editIcon.src='Images/icons8-edit-50.png';
    editIcon.className='icon';
    //Put the edit icon in the edit button
    editButton.appendChild(editIcon);
    //Put the subject id in the edit button
    editButton.setAttribute('value',subject.subjectID);
    //Add an event listener to the edit button
    editButton.addEventListener('click',()=>{
        editSubject(subject.subjectID);
    });
    //Create the delete button
    let deleteButton=document.createElement('button');
    deleteButton.className='shelf-delete-btn';
    //Create the delete icon
    let deleteIcon=document.createElement('img');
    deleteIcon.src='Images/icons8-trash-24.png';
    deleteIcon.className='icon';
    //Put the delete icon in the delete button
    deleteButton.appendChild(deleteIcon);
    //Put the subject id in the delete button
    deleteButton.setAttribute('value',subject.subjectID);
    //Add an event listener to the delete button
    deleteButton.addEventListener('click',()=>{
        deleteSubject(subject.subjectID);
    });
    //Put the edit button in the shelf actions
    shelfActions.appendChild(editButton);
    //Put the delete button in the shelf actions
    shelfActions.appendChild(deleteButton);
    //Put the shelf actions in the shelf 
    shelf.appendChild(shelfActions);
    //Create the add book div
    let addBook=document.createElement('div');
    addBook.className='add-book';
    //Create the add book button
    let addBookButton=document.createElement('button');
    addBookButton.className='add-book-btn';
    addBookButton.textContent='Add New Book';
    //Put the add book button in the add book div
    addBook.appendChild(addBookButton);
    //Put the add book div in the shelf
    shelf.appendChild(addBook);
    //set a value in the button for the id of the subject
    addBookButton.setAttribute('value',subject.subjectID);
    //Add an event listener to the add book button
    addBookButton.addEventListener('click',openBookForm);
    //Return the subject element
    return shelf;
}
//Function to edit a subject
function editSubject(id){
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:id
        }
    }).then((subject)=>{
        subject=subject.dataValues;//Get the subject data values
        //Get the subject form
        let subjectForm = document.getElementById('subjectForm');
        //Get the subject name
        let subjectName = subjectForm.querySelector('#subjectName');
        //Get the subject description
        let subjectDescription = subjectForm.querySelector('#subjectDescription');
        //Set the subject name
        subjectName.value=subject.name;
        //Set the subject description
        subjectDescription.value=subject.description;
        //Show the subject form
        subjectForm.style.display='block';
        //Get the save button
        let saveButton=document.getElementById('saveSubject');
        //Change the save button to an update button
        saveButton.textContent='Edit Subject';
        //Remove the event listener from the save button
        saveButton.removeEventListener('click',saveSubject);
        saveButton.onclick=null;
        //put the subject id in the save button
        saveButton.setAttribute('value',subject.subjectID);
        //Add an event listener to the update button
        saveButton.addEventListener('click',saveSubjectEdit);
    });
    //Toggle the subject form
    toggleSubjectForm();
}

function saveSubjectEdit(e){
    //Get the subject id
    let subjectID=e.target.getAttribute('value');
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:subjectID
        }
    }).then((subject)=>{
        //Get the subject form
        let subjectForm = document.getElementById('subjectForm');
        //Get the subject name
        let subjectName = subjectForm.querySelector('#subjectName').value;
        //Get the subject description
        let subjectDescription = subjectForm.querySelector('#subjectDescription').value;
        //Update the subject
        subject.update({
            name:subjectName,
            description:subjectDescription
        });
        //Hide the subject form
        subjectForm.style.display='none';
        //Clear the subject form
        clearSubjectForm();
        //Load the subjects
        loadSubjects();
        //Get the save button
        let saveButton=document.getElementById('saveSubject');
        //Change the update button to a save button
        saveButton.textContent='Save Subject';
        //Remove the event listener from the update button
        saveButton.removeEventListener('click',saveSubjectEdit);
        saveButton.onclick=null;
        //Add an event listener to the save button
        saveButton.addEventListener('click',saveSubject);
    });
}

//Function to toggle the bookform
function toggleBookForm(){
    let bookForm=document.getElementById('bookForm');
    //Check if the book form is hidden
    if(bookForm.style.display==='none'||bookForm.style.display===''){
        //If the book form is hidden, show it
        bookForm.style.display='block';
    }else{
        //If the book form is shown, hide it
        bookForm.style.display='none';
    }
}
function openBookForm(event){
    //Get the subject id
    let subjectID=event.target.getAttribute('value');
    //Get the book form
    let bookForm=document.getElementById('bookForm');
    //Put the subject id in the book form
    bookForm.setAttribute('value',subjectID);
    toggleBookForm();
}
// Function to add a new book into the shelf
function saveBook()
{
    //Get the data from the book form
    let bookForm=document.getElementById('bookForm');
    let bookTitle=bookForm.querySelector('#bookTitle').value;
    //To get the subject id from the book form
    let subjectID=bookForm.getAttribute('value');
    //Create a new book
    let bookPath=createBook(bookTitle);
    if(bookPath)
    {
        //Create a new book object
        let book={
            name:bookTitle,//The book title is the name
            storageLocation:bookPath,
            subjectID:subjectID
        };
        //Save the book to the database
        Notes.create(book);
        //Hide the book form
        bookForm.style.display='none';
        //Clear the book form
        clearBookForm();
        //Load the subjects
        loadSubjects();
    }
    else{
        //If the book title is invalid, show an alert
        alert('Invalid book title');
    }
}
//Function to create a book as a markdown file in the Storage folder
function createBook(title){
    //Takes a name as the argument and creates the book
    //It returns the relative path to the book from the Storage folder
    //To validate the book title
    if(!validateBookTitle(title)){
        //If the title is invalid, return false
        return false;
    }
    //Create a new book
    let bookPath=path.resolve(__dirname,'../Storage',`${title}.md`);
    //Create the book
    fs.writeFileSync(bookPath,'');
    //Get the relative path to the book
    let relativePath="/Storage/"+`${title}.md`;
    //Return the relative path to the book
    return relativePath;
}
//Function to validate the bookTitle so it doesn't contain any special characters or illegal characters
function validateBookTitle(title){
    //Check if the title is empty
    if(title===''){
        //If the title is empty, return false
        return false;
    }
    //Check if the title contains any special characters
    if(/[^a-zA-Z0-9\s]/.test(title)){
        //If the title contains special characters, return false
        return false;
    }
    //If the title is valid, return true
    return true;
} 
//Function to clear the book form
function clearBookForm(){
    //Clear the book title
    document.getElementById('bookTitle').value='';
}
//Function to create the HTML for the books for each subject
function generateBooksHTML(books) {
    console.log("I am here in generateBooksHTML");
    // Create a container div for the books
    const booksDiv = document.createElement('div');
    booksDiv.className = 'books';
    // Iterate over the books data to create individual book elements
    books.forEach(book => {
        // Create a div for the book
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        // Create a div for the book title
        const bookTitleDiv = document.createElement('div');
        bookTitleDiv.className = 'book-title';
        bookTitleDiv.textContent = book.name;
        // Create a div for the book actions
        const bookActionsDiv = document.createElement('div');
        bookActionsDiv.className = 'book-actions';
        // Create an open button
        const openButton = document.createElement('button');
        openButton.className = 'book-open-btn';
        const openIcon = document.createElement('img');
        openIcon.src = 'Images/icons8-open-30.png';
        //Put the book id in the open icon
        openIcon.setAttribute('value',book.noteID);
        openIcon.className = 'icon';
        openButton.appendChild(openIcon);
        //Add an event listener to the open button
        openButton.addEventListener('click', openBook);
        //Put the book id in the open button
        openButton.setAttribute('value',book.noteID);
        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'Images/icons8-trash-24.png';
        deleteIcon.className = 'icon';
        //Put the book id in the delete icon
        deleteIcon.setAttribute('value',book.noteID);
        deleteButton.appendChild(deleteIcon);
        //Put the book id in the delete button
        deleteButton.setAttribute('value',book.noteID);
        // Add an event listener to the delete button
        deleteButton.addEventListener('click', deleteBook);
        // Append buttons to the actions div
        bookActionsDiv.appendChild(openButton);
        bookActionsDiv.appendChild(deleteButton);
        // Append the title and actions divs to the book div
        bookDiv.appendChild(bookTitleDiv);
        bookDiv.appendChild(bookActionsDiv);
        // Append the book div to the books container div
        booksDiv.appendChild(bookDiv);
    });

    // Return the container div containing all books
    return booksDiv;
}
//Function to get the html of a particular subject and load the html into it
async function fillSubject(subjectID){
    let targetID="shelf"+subjectID;
    let target=document.getElementById(targetID);
    let afterSection=target.querySelector('.add-book');
    //Get the books that belong to the subject
    let books=await getBooks(subjectID);
    //Create the books HTML
    let booksHTML=generateBooksHTML(books);
    //Append the books HTML to the target before the add book section
    target.insertBefore(booksHTML,afterSection);
}

//function to get all the books belonging to a subject
async function getBooks(subjectID){
    let booksArray=[];
    //Find all the books in the database
    await Notes.findAll({
        where:{
            subjectID:subjectID
        }
    }).then((books)=>{
         books.forEach((book)=>{
            booksArray.push(book.dataValues);
        }
        );
    });
    return booksArray;
}
//Function to delete a subject
function deleteSubject(id){
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:id
        }
    }).then((subject)=>{
        //Delete the subject
        subject.destroy();
        //Load the subjects
        loadSubjects();
    });
}

//Function to delete a book
function deleteBook(event){
    //Get the book id
    let id=event.target.getAttribute('value');
   //Parse the id to an integer
    //Find the book in the database
    Notes.findOne({
        where:{
            noteID:id
        }
    }).then((book)=>{
        //Delete the book
        book.destroy();
        //Delete the book from the storage
        let bookPath=".."+book.dataValues.storageLocation;
        //Sample File  Path:/Storage/12345.md
        //This is relative to the main.js file
        //To get the absolute path
        bookPath=path.resolve(__dirname,bookPath);
        fs.unlinkSync(bookPath);
        //Load the subjects
        loadSubjects();
    });
}
//Function to toggle the BookReader
function toggleBookReader(){
    //Get the book reader
    let bookReader=document.getElementById('bookReader');
    //Check if the book reader is hidden
    if(bookReader.style.display==='none'||bookReader.style.display==='' || bookReader.style.display===undefined){
        //If the book reader is hidden, show it
        bookReader.style.display='block';
    }else{
        //If the book reader is shown, hide it
        bookReader.style.display='none';
    }
}
//Function to launch a preview Tab for the book
function openBook(event){
    const rendered=document.getElementById('rendered');
    //Get the book id
    let id=event.target.getAttribute('value');
    toggleBookReader();
    //Find the book in the database
    Notes.findOne({
        where:{
            noteID:id
        }
    }).then((book)=>{
        //Get the book title
        let bookTitle=book.dataValues.name;
        //Get the book reader heading
        let bookReaderHeading=document.getElementById('bookReaderHeading');
        //Get the book title element
        let bookTitleElement=bookReaderHeading.querySelector('h2');
        //Put the book title in the book reader heading
        bookTitleElement.textContent=bookTitle;
        //Get the book path
        let bookPath=".."+book.dataValues.storageLocation;
        //Sample File  Path:/Storage/12345.md
        //This is relative to the main.js file
        //To get the absolute path
        bookPath=path.resolve(__dirname,bookPath);
        //Read the book
        let bookContent=fs.readFileSync(bookPath,'utf-8');
        //Render the content in the book reader
        rendered.innerHTML = marked.parse(bookContent); 
        //Perform Syntax Highlighting
        rendered.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        //Get the edit button
        let editButton=document.getElementById('editBook');
        //Put the book id in the edit button
        editButton.setAttribute('value',id);
    });
}
//Function to close the book
function closeBook()
{
    toggleBookReader();
}

//Function to toggle the visibility of the editor
function toggleEditor()
{
    //Get the editor
    let editor=document.getElementById('bookEditor');
    //Check if the editor is hidden
    if(editor.style.display==='none'||editor.style.display==='' || editor.style.display===undefined){
        //If the editor is hidden, show it
        editor.style.display='block';
    }else{
        //If the editor is shown, hide it
        editor.style.display='none';
    }

}
//Function to toggle the editing area for the book
function editBook(event){
    //Get the book id
    let id=event.target.getAttribute('value');
    toggleEditor();
    //Find the book in the database
    Notes.findOne({
        where:{
            noteID:id
        }
    }).then((book)=>{
        //Get the book title
        let bookTitle=book.dataValues.name;
        //Put the book title in the editor heading
        //First get the editor heading
        let editorHeading=document.getElementById('bookEditorHeading');
        let bookTitleElement=editorHeading.querySelector('h2');
        //Put the book title in the editor heading
        bookTitleElement.textContent=bookTitle;
        //Get the book path
        let bookPath=".."+book.dataValues.storageLocation;
        //Sample File  Path:/Storage/12345.md
        //This is relative to the main.js file
        //To get the absolute path
        bookPath=path.resolve(__dirname,bookPath);
        //Read the book
        let bookContent=fs.readFileSync(bookPath,'utf-8');
        //Put the book content in the editor
        document.getElementById('rawMarkdown').value=bookContent;
        //Get the save button
        let saveButton=document.getElementById('saveEdit');
        //Put the book id in the save button
        saveButton.setAttribute('value',id);
        //Put the book path in the save button
        saveButton.setAttribute('path',bookPath);
        //Add an event listener to the save button
        saveButton.addEventListener('click',saveBookEdit);

        //To render the book content
        let preview=document.getElementById('editorpreview');
        //Render the book content
        preview.innerHTML = marked.parse(bookContent);
        //Perform Syntax Highlighting
        preview.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    });
}

//Function to save and live preview the edited book
function liveKeys()
{
    //Get the raw markdown
    let rawMarkdown=document.getElementById('rawMarkdown');
    //Get the rendered markdown
    let rendered=document.getElementById('editorpreview');
    //Render the raw markdown
    rendered.innerHTML = marked.parse(rawMarkdown.value); 
    //Perform Syntax Highlighting
    rendered.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    //To save the book
    //Get the save button
    let saveButton=document.querySelector('.saveBookEdit');
    //Get the file path
    let bookPath=saveButton.getAttribute('path');
    //Write the book content to the book
    fs.writeFileSync(bookPath,rawMarkdown.value);
}

//Function to save the edited book
function saveBookEdit(event){
    //Get the book id
    let id=event.target.getAttribute('value');
    //Find the book in the database
    Notes.findOne({
        where:{
            noteID:id
        }
    }).then((book)=>{
        //Get the book path
        let bookPath=".."+book.dataValues.storageLocation;
        //Sample File  Path:/Storage/12345.md
        //This is relative to the main.js file
        //To get the absolute path
        bookPath=path.resolve(__dirname,bookPath);
        //Get the book content
        let bookContent=document.getElementById('rawMarkdown').value;
        //Write the book content to the book
        fs.writeFileSync(bookPath,bookContent);
        //Hide the editor
        toggleEditor();
        //Close the book
        closeBook();
    });
}

//Function to close the book editor
function closeEditor()
{
    //Re-render the book content in the reader
    let newBookContent=document.getElementById('rawMarkdown').value;
    let rendered=document.getElementById('rendered');
    //Render the content in the book reader
    rendered.innerHTML = marked.parse(newBookContent);
    //Perform Syntax Highlighting
    rendered.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    toggleEditor();
}
//Export the functions
module.exports={
    toggleNotes,
    toggleSubjectForm,
    saveSubject,
    editSubject,
    saveBook,
    toggleBookForm,
    openBookForm,
    toggleBookReader,
    closeBook,
    editBook,
    liveKeys,
    closeEditor 
}
