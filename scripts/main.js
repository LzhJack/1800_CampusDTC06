function signOut() {
    auth.signOut();
    alert("Sign Out Successfully from System");
}

// Keep to store all cards and user uid 
var cards_lists = [];

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 
            cards_lists.push(user.uid);
            // This function will set the users name, i.e. Welcome Urjit
            set_user_name(user);

            // This will get all cards the user made and populate it to the page
            load_cards(user);


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
}

async function load_cards(user) {
    await get_documents(user.uid)
        .then(function () {
            card_documents.forEach(function (element) {

                var due_date = element['due']
                var title = element['title']
                var description = element['description']
                var card_id = element['card_id']


                cards_lists.push(card_id);
                create_card_from_db(title, description, due_date, card_id);

            })
        })

}



function create_card_from_db(title, description, due_date, card_id) {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);

    clon.getElementById("assignment_title").value = title;
    clon.getElementById("assignment_description").value = description;
    clon.getElementById("due_date").value = due_date;

    clon.getElementById('assignment_card').id = card_id;
    clon.getElementById('content_store').id = card_id + 1;
    clon.getElementById('personalInfoFields').id = card_id + 2;
    clon.getElementById('collapse_content').id = card_id + 3;
    clon.getElementById('collapseExample').id = card_id + 4;
    clon.getElementById('collapse_div').id = card_id + 5;

    // Set input ids
    clon.getElementById("assignment_title").id = card_id + 'title';
    clon.getElementById("assignment_description").id = card_id + 'desc';
    clon.getElementById("due_date").id = card_id + 'due';

    document.getElementById('card_container').appendChild(clon);
}

var card_active = false;

function collapse_obj(obj) {
    var section = document.getElementById(obj.id);
    var parent_div = section.parentElement;
    var card_id = String(parent_div.children[1].id);
    var section2 = document.getElementById(card_id);
    var card_id2 = String(section2.children[0].id);

    var section3 = document.getElementById(card_id2);
    if (!card_active) {
        card_active = true;
        return new bootstrap.Collapse(section3)
    }
}


async function saveUserInfo(obj) {
    disable_card_form(obj, true);

    // Navigate to the collapseExample equivalent html
    var card_id = String(obj.parentElement.id);
    var section2 = document.getElementById(card_id);
    var card_id2 = String(section2.parentElement.id);
    var section3 = document.getElementById(card_id2);

    await save_new_info(card_id2)
    if (card_active) {
        card_active = false;
        return new bootstrap.Collapse(section3)
    }
}

function get_cardid(cardid) {
    if (cardid.length == 6) {
        found_card_id = cardid.match(/.{1,5}/g);
        return found_card_id[0]
    } else {
        found_card_id = cardid.match(/.{1,6}/g);
        return found_card_id[0]
    }
}


async function save_new_info(card_id) {
    // Save the acutal new infromation
    actual_cardid = get_cardid(card_id);
    console.log(actual_cardid);

    db.collection("users").doc(cards_lists[0]).collection("cards").doc(actual_cardid).set({
        card_id: actual_cardid,
        description: document.getElementById(actual_cardid + 'desc').value,
        due: document.getElementById(actual_cardid + 'due').value,
        title: document.getElementById(actual_cardid + 'title').value,
    })
}



function disable_card_form(obj, state) {
    parent_div1 = obj.parentElement;
    parent_div2 = parent_div1.parentElement;
    parent_div3 = parent_div2.parentElement;
    parent_div4 = parent_div3.parentElement;

    var card_id = String(parent_div4.children[0].id);
    var section1 = document.getElementById(card_id);
    var card_id2 = String(section1.children[0].id);
    var section2 = document.getElementById(card_id2);

    document.getElementById(section2.id).disabled = state;
}


function add_card() {
    if (cards_lists.length > 1) {
        last_element = cards_lists[cards_lists.length - 1];
        found_card_number = last_element.match(/.{1,4}/g);
        new_number = parseInt(found_card_number[1]);
        new_number = new_number + 1;
        new_card_id = 'card' + String(new_number);
        create_card_from_db('Assignment Title', 'Assignment Description', '11/11/2021', new_card_id);
        cards_lists.push(new_card_id);
        user_card_list[0] = user_card_list[0] + ' ' + new_card_id;

    } else {           
        cards_lists.push('card1');
        db.collection('users').doc(cards_lists[0]).collection("cards").doc("card1").set({
            title: 'Assignment Title',
            description: 'Assignment Description',
            due: '11/11/2021',
            card_id: 'card1'
        });
        create_card_from_db('Assignment Title', 'Assignment Description', '11/11/2021', "card1");

    }   

}


function no_cards_exist() {
    if (cards_lists.length == 1) {
        console.log(cards_lists);
        document.getElementById("error_messages").innerHTML = 'You currently have no cards saved';
    }
}
no_cards_exist();

