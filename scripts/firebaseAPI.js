 var firebaseConfig = {
     apiKey: "AIzaSyD5gG_Xo06fJ1opNb09HKRsYw4f2fE8BOc",
     authDomain: "iminder-d7d5f.firebaseapp.com",
     projectId: "iminder-d7d5f",
     storageBucket: "iminder-d7d5f.appspot.com",
     messagingSenderId: "396693756483",
     appId: "1:396693756483:web:4af1675452dc35437092f6",
     measurementId: "G-VLYGXNNE46"
 };


 firebase.initializeApp(firebaseConfig);
 const db = firebase.firestore();
 const auth = firebase.auth();
 var creating_account = false;

 function create_signUp() {
     var sign_up_button = document.getElementById("sign_up");
     var log_in_button = document.getElementById("login_button");
     var user_name_input = document.getElementById("user_name")

     var currently_changing_text = false
     if (!currently_changing_text & sign_up_button.textContent == 'Sign Up?') {
         currently_changing_text = true
         user_name_input.style.display = 'inline-block'
         sign_up_button.textContent = 'Log In?'
         log_in_button.value = 'Sign Up'
     }

     if (!currently_changing_text & sign_up_button.textContent == 'Log In?') {
         currently_changing_text = true
         user_name_input.style.display = 'none'
         sign_up_button.textContent = 'Sign Up?'
         log_in_button.value = 'Log In'
     }
     currently_changing_text = false

 }



 function authentificate_button() {
     var current_option = login_button.value

     if (current_option == 'Sign Up') {
         creating_account = true;
         console.log("Signing Up");
         var email = document.getElementById("login_email");
         var password = document.getElementById("password");


         //const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
         firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function (result) {
             console.log(result)
             result.user.updateProfile({
                 displayName: document.getElementById("user_name").value
             });
             db.collection('users').doc(result.user.uid).set({
                     name: document.getElementById("user_name").value,
                     email: result.user.email
                 })
                 .then(function () {
                     console.log('Work?');
                     window.location.assign('main.html');
                 })

         })


     }

     if (current_option == 'Log In') {
         console.log("Log In")

         var email = document.getElementById("login_email");
         var password = document.getElementById("password");
         const promise = auth.signInWithEmailAndPassword(email.value, password.value);

         promise.catch(e => alert(e.message)) //.then(window.location.assign('main.html'));;
         
     }
 }


 function signOut() {
     auth.signOut();
     alert("Sign Out Successfully from System");
 }