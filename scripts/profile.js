user_id = ''

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            user_id = user.uid;
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    document.getElementById('display_user_name').innerText = "Hello " + userDoc.data().name;
                })
        } else {
            window.location.assign("login.html");
        }
    });
}

insertName();

function save_data() {
    db.collection("users").doc(user_id).update({
        name: document.getElementById('fname').value,
        notification_email: document.getElementById('cemail').value,
        phone_number: document.getElementById('cphone').value,
        notification_state: document.getElementById('flexRadioDefault2').value,
    })
    insertName()
}