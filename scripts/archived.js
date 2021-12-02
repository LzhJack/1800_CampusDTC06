function signOut() {
    /**
     * This function signs the user out
     */
    auth.signOut();
    alert("Sign Out Successfully from System");
}

// Global Variables
var cards_lists = [];
var not_saved_yet = false;
var user_card_list = [];
var card_documents = [];
var current_highest_card = 0;
var card_active = false;

function get_user_login_status() {
    /**
     * This function checks if the user is logged in and if they are it creates the cards saved in their collection
     * In case the user is not logged in then it will re-direct to the login page
     */
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 
            cards_lists.push(user.uid);

            // This will get all cards the user made and populate it to the page
            get_documents(user.uid);


        } else {
            // No user is signed in.
            window.location.assign("login.html");
        }
    });
}

get_user_login_status();




async function get_documents(user_id) {
    /**
     * This function queries for all the archived cards in the users card collection 
     */
    const snapshot = await db.collection('users').doc(user_id).collection('cards').get()
    snapshot.docs.map(doc => {
        var single_doc = doc.data();
        card_documents.push(single_doc);
    });
    db.collection('users').doc(user_id).collection('cards').where("archive", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                var single_doc = doc.data();

                var due_date = single_doc['due']
                var title = single_doc['title']
                var description = single_doc['description']
                var card_id = single_doc['card_id']

                cards_lists.push(card_id)
                create_card_from_db(title, description, due_date, card_id);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}



function create_card_from_db(title, description, due_date, card_id) {
    /**
     * This function is responsible for creating all the cards on the page
     */

    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);

    clon.getElementById("assignment_title").value = title;
    clon.getElementById("assignment_description").value = description;
    clon.getElementById("testdate").value = due_date;

    clon.getElementById("assignment_title").placeholder = title;
    clon.getElementById("assignment_description").placeholder = description;
    clon.getElementById("testdate").placeholder = due_date;

    clon.getElementById('assignment_card').id = card_id;
    clon.getElementById('content_store').id = card_id + 1;
    clon.getElementById('personalInfoFields').id = card_id + 2;
    clon.getElementById('collapse_content').id = card_id + 3;
    clon.getElementById('collapseExample').id = card_id + 4;
    clon.getElementById('collapse_div').id = card_id + 5;

    // Set input ids
    clon.getElementById("assignment_title").id = card_id + 'title';
    clon.getElementById("assignment_description").id = card_id + 'desc';
    clon.getElementById("testdate").id = card_id + 'due';

    document.getElementById('card_container').appendChild(clon);



}



function collapse_obj(obj, using_card_id) {
    /**
     * This function collapses the current selected card
     */
    if (!card_active) {
        if (!using_card_id) {
            let section = document.getElementById(obj.id);
            let parent_div = section.parentElement;
            let current_card_id = parent_div.parentElement;
            sessionStorage.setItem('card_id', current_card_id.id);

            let collase_div = document.getElementById(current_card_id.id + '4');

            if (!card_active) {
                card_active = true;

                return new bootstrap.Collapse(collase_div)
            }
        }



    }
    if (card_active) {
        if (using_card_id) {
            card_active = false;
            console.log('dad')
            let current_card_id1 = sessionStorage.getItem('card_id');
            console.log(current_card_id1 + '4')

            return new bootstrap.Collapse(document.getElementById(current_card_id1 + '4'))
        }
    }

}




function delete_card() {
    /**
     * This function deletes the card from the page and from the database CRUD
     */
    let current_card_id = sessionStorage.getItem('card_id');
    db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).delete()
    let card_div = document.getElementById(current_card_id);
    card_div.remove();
    card_active = false;
}

function un_archive() {
    /**
     * This function un-archives the current selected card and removes it from the page
     */
    let current_card_id = sessionStorage.getItem('card_id');

    db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).update({
        description: document.getElementById(current_card_id + 'desc').value,
        due: document.getElementById(current_card_id + 'due').value,
        title: document.getElementById(current_card_id + 'title').value,
        archive: false
    })
    let card_div = document.getElementById(current_card_id);
    card_div.remove();
    card_active = false;
}
