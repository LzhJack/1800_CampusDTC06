user_id = ''

function get_user_login_status() {
    /**
     * This function checks if the user is logged in and if they are it creates the cards saved in their collection
     * In case the user is not logged in then it will re-direct to the login page
     */
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

get_user_login_status();

function save_data() {
    /**
     * This function saves the profile data to the users document
     */
    db.collection("users").doc(user_id).update({
        name: document.getElementById('fname').value,
        notification_email: document.getElementById('cemail').value,
        phone_number: document.getElementById('cphone').value,
        notification_state: document.getElementById('flexRadioDefault2').value,
    })
    insertName()
}