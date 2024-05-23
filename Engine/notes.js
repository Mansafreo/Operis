
//To toggle the display of the projects
function toggleNotes() {
    //Get the projects container
    let notesSection = document.getElementsByClassName('notes')[0];
    //Check if the projects container is hidden
    if (notesSection.style.display === 'none' || notesSection.style.display === '') {
        //If the projects container is hidden, show it
        notesSection.style.display = 'block';
        // //load the projects
        // loadProjects();
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


module.exports={
    toggleNotes,
    toggleSubjectForm
}
