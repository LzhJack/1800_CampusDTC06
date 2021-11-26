function signOut() {
    auth.signOut();
    alert("Sign Out Successfully from System");
}

// Keep to store all cards and user uid 
var cards_lists = [];
var not_saved_yet = false;

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 
            cards_lists.push(user.uid);
            // This function will set the users name, i.e. Welcome Urjit
            set_user_name(user);

            // This will get all cards the user made and populate it to the page
            get_documents(user.uid);


        } else {
            // No user is signed in.
            window.location.assign("login.html");
        }
    });
}

insertName();

function set_user_name(user) {
    //go to the correct user document by referencing to the user uid
    currentUser = db.collection("users").doc(user.uid);
    //get the document for current user.
    currentUser.get()
        .then(userDoc => {
            var user_Name = userDoc.data().name;
            // display name 
            $("#user_name").text('Welcome ' + user_Name);
        })
}


// Keep
var user_card_list = [];
var card_documents = [];
var current_highest_card = 0;

async function get_documents(user_id) {
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
    if (cards_lists == 0) {
        console.log('none');
    }
    console.log(cards_lists);
}



function create_card_from_db(title, description, due_date, card_id) {

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


var card_active = false;

function collapse_obj(obj, using_card_id) {
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
    let current_card_id = sessionStorage.getItem('card_id');
    db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).delete()
    let card_div = document.getElementById(current_card_id);
    card_div.remove();
    card_active = false;
}

function un_archive() {
    //let current_card_id = sessionStorage.getItem('card_id');
    //db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).delete()
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

function no_cards_exist() {
    if (cards_lists.length == 1) {
        console.log(cards_lists);
        document.getElementById("error_messages").innerHTML = 'You currently have no cards saved';
    }
}
no_cards_exist();