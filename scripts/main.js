function signOut() {
    auth.signOut();
    alert("Sign Out Successfully from System");
}

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 

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

function load_cards(user) {
    var card_list = ''
    var card_id = []
    currentUser = db.collection("users").doc(user.uid);
    currentUser.get()
        .then(userDoc => {
            card_list = userDoc.data().cards;
        })
        .then(function () {
            try {
                card_id = card_list.split(/\s+/);
            } catch (err) {
                no_cards_exist();
            }
        })
        .then(function () {
            card_id.forEach(function (element) {
                cards_data = db.collection("users").doc(user.uid).collection("cards").doc(String(element));
                //get the document for current user.
                cards_data.get()
                    .then(userDoc => {
                        var due_date = userDoc.data().due;
                        var title = userDoc.data().title;
                        var description = userDoc.data().description;
                        var card_id = userDoc.data().card_id;


                        create_card_from_db(title, description, due_date, card_id);
                    })
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


function saveUserInfo(obj) {
    disable_card_form(obj, true);

    var card_id = String(obj.parentElement.id);
    console.log(card_id);
    var section2 = document.getElementById(card_id);
    var card_id2 = String(section2.parentElement.id);
    console.log(card_id2);

    var section3 = document.getElementById(card_id2);
    console.log(card_active);

    if (card_active) {
        card_active = false;
        return new bootstrap.Collapse(section3)
    }
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
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    clon.getElementById('collapseExample').id = 'yes';
    document.getElementById('card_container').appendChild(clon);
}


function no_cards_exist() {
    document.getElementById("card_container").innerHTML = 'You currently have no cards saved';
}

function select_date() {
    console.log("touched")

    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);

}