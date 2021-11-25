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
    db.collection('users').doc(user_id).collection('cards').where("archive", "==", false)
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


var generate_cal = false;

function get_user() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            localStorage.removeItem('events');
            // This will get all cards the user made and populate it to the page
            get_documents2(user.uid);


        } else {
            // No user is signed in.
            window.location.assign("login.html");
        }
    });
}

get_user();

var card_documents2 = [];
var due_month_and_day = [];
var events_to_make = []

async function get_documents2(user_id) {
        console.log('load')
        db.collection('users').doc(user_id).collection('cards').where("archive", "==", false)
            .get()
            .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                            var single_doc = doc.data();
                            card_documents2.push(single_doc);
                            var due_date = single_doc['due'];
                            var title = single_doc['title'];
                            let new_string = due_date.split("/");

                            var mm1 = new_string[0] - 1;
                            var new_date = mm1.toString() + new_string[1]
                            var new_date2 = new_string[1] + mm1.toString() + new_string[2];
                            
                            if (new_date2[0] == '0') {
                                new_date2 = new_date2.substring(1)
                            }
                            if (new_date[2] == '0') {
                                new_date = new_date.split('');
                                console.log(new_date)
                                new_date.splice(2, 1);
                                new_date = new_date.join('');
                            }
                            due_month_and_day.push(new_date);
                            
                            

                            let events = localStorage.getItem('events');
                            if (events) {
                                events_to_make = JSON.parse(events);
                            }
                            let eventText = title

                            let id = 1;
                            if (events_to_make.length > 0) {
                                id = Math.max.apply('', events_to_make.map(function (entry) {
                                    return parseFloat(entry.id);
                                })) + 1;
                            } else {
                                id = 1;
                            }
                            events_to_make.push({
                                'id': id,
                                'eventDate': new_date2,
                                'eventText': eventText
                            });
                            localStorage.setItem('events', JSON.stringify(events_to_make));
                            localStorage.setItem("events_to_set1", JSON.stringify(due_month_and_day));
                        })
                })
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
            change_box_shadow(card_id, due_date, true);



        }

        function change_box_shadow(card_id, due_date, on_load) {
            if (on_load) {
                if (due_date <= get_current_day()) {
                    card = document.getElementById(card_id);
                    card.style.boxShadow = "0 5px 20px 3px red";
                    card.style.border = "2px solid red";
                }
            } else if (!on_load) {
                let current_card_id = sessionStorage.getItem('card_id');
                due_date = document.getElementById(current_card_id + 'due');
                if (due_date.value <= get_current_day()) {
                    cardcc = document.getElementById(current_card_id);
                    cardcc.style.boxShadow = "0 5px 20px 3px red";
                    cardcc.style.border = "2px solid red";
                } else if (due_date.value > get_current_day()) {
                    cardcc = document.getElementById(current_card_id);
                    cardcc.style.boxShadow = "0 5px 20px 3px #371BB1";
                    cardcc.style.border = "2px solid #371BB1";
                }
            }
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
                        let current_card_id1 = sessionStorage.getItem('card_id');

                        $('#' + current_card_id1 + 'due').on("blur", function () {
                            var test1 = $('#' + current_card_id1 + 'due').val();
                            if (test1.trim() == "" || test1 == null) {
                                if ($(".datepicker").length == 0) {
                                    $('#' + current_card_id1 + 'due').focus();
                                }
                            }
                        })
                        $('#' + current_card_id1 + 'due').datepicker({
                            autoclose: true,
                        });

                        return new bootstrap.Collapse(collase_div)
                    }
                } else {
                    sessionStorage.setItem('card_id', obj);
                    let collase_div = document.getElementById(obj + '4');
                    if (!card_active) {
                        card_active = true;
                        let current_card_id1 = sessionStorage.getItem('card_id');

                        $('#' + current_card_id1 + 'due').on("blur", function () {
                            var test1 = $('#' + current_card_id1 + 'due').val();
                            if (test1.trim() == "" || test1 == null) {
                                if ($(".datepicker").length == 0) {
                                    $('#' + current_card_id1 + 'due').focus();
                                }
                            }
                        })
                        $('#' + current_card_id1 + 'due').datepicker({
                            autoclose: true,
                        });

                        return new bootstrap.Collapse(collase_div)
                    }
                }




            }

        }


        async function saveUserInfo() {
            disable_card_form(true);
            change_box_shadow('', '', false);
            let current_card_id = sessionStorage.getItem('card_id');
            let collapsable = document.getElementById(current_card_id + '4');

            await save_new_info()
            if (card_active) {
                sessionStorage.removeItem('card_id');
                card_active = false;
                return new bootstrap.Collapse(collapsable)
            }
        }


        async function save_new_info() {
            // Save the acutal new infromation
            let current_card_id = sessionStorage.getItem('card_id');
            db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).set({
                    card_id: current_card_id,
                    description: document.getElementById(current_card_id + 'desc').value,
                    due: document.getElementById(current_card_id + 'due').value,
                    title: document.getElementById(current_card_id + 'title').value,
                    archive: false
                })
                .then(function () {
                    if (send_to_reminder_bool) {
                        not_saved_yet = false;
                        send_to_reminder()
                    }
                })

        }



        function disable_card_form(state) {
            let current_card_id = sessionStorage.getItem('card_id');
            not_saved_yet = true;
            document.getElementById(current_card_id + '2').disabled = state;
        }


        function add_card() {
            if (!card_active) {
                if (cards_lists.length > 1) {
                    last_element = cards_lists[cards_lists.length - 1];
                    found_card_number = last_element.match(/.{1,4}/g);
                    new_number = parseInt(found_card_number[1]);
                    new_number = new_number + 1;
                    new_card_id = 'card' + String(new_number);
                    create_card_from_db('Assignment Title', 'Assignment Description', '11/11/2021', new_card_id);
                    cards_lists.push(new_card_id);
                    user_card_list[0] = user_card_list[0] + ' ' + new_card_id;
                    collapse_obj(new_card_id, true);
                    disable_card_form(false);
                } else {
                    cards_lists.push('card1');
                    db.collection('users').doc(cards_lists[0]).collection("cards").doc("card1").set({
                        title: 'Assignment Title',
                        description: 'Assignment Description',
                        due: '11/11/2021',
                        card_id: 'card1',
                        archive: false
                    });
                    create_card_from_db('Assignment Title', 'Assignment Description', '11/11/2021', "card1");
                    collapse_obj("card1", true);
                    disable_card_form(false);
                }
            }

        }

        function remove_card() {
            //let current_card_id = sessionStorage.getItem('card_id');
            //db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).delete()
            let current_card_id = sessionStorage.getItem('card_id');

            db.collection("users").doc(cards_lists[0]).collection("cards").doc(current_card_id).update({
                description: document.getElementById(current_card_id + 'desc').value,
                due: document.getElementById(current_card_id + 'due').value,
                title: document.getElementById(current_card_id + 'title').value,
                archive: true
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

        function get_current_day() {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            return today;
        }

        function send_to_reminder() {
            send_to_reminder_bool = true;
            let current_card_id = sessionStorage.getItem('card_id');

            var pageContent = document.getElementById(current_card_id + '1').innerHTML;
            sessionStorage.setItem("page1content", pageContent)
            if (not_saved_yet) {
                console.log('da')
                $('.toast-body').html('You have not saved yet');
                $('.toast').toast('show');

            } else {
                window.location.assign("./reminders.html");
            }


        }