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
        } else {
            window.location.assign("login.html");
        }
    });
}

get_user_login_status();

function save_data() {
    /**
     * This function Saves the users notification choice to the current selected cards document
     */
    let current_card_id = sessionStorage.getItem('card_id');

    db.collection("users").doc(user_id).collection("cards").doc(current_card_id).update({
        notification_frequency: document.getElementById('notification_times').value,
        notification_date: document.getElementById('testdate').value,
        notification_type: document.getElementById('phone_notification').value,
    })
}