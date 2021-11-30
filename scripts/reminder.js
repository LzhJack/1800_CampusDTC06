user_id = ''

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            user_id = user.uid;
        } else {
            window.location.assign("login.html");
        }
    });
}

insertName();
function save_data() {
    let current_card_id = sessionStorage.getItem('card_id');

    db.collection("users").doc(user_id).collection("cards").doc(current_card_id).update({
        notification_frequency: document.getElementById('notification_times').value,
        notification_date: document.getElementById('testdate').value,
        notification_type: document.getElementById('phone_notification').value,
    })
}