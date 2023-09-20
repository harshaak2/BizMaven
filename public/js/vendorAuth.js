function changetoLoginPageVendor(){
    document.querySelector("#signupPageVendor").classList.add("form--hidden");
    document.querySelector("#loginPageVendor").classList.remove("form--hidden");
}
 
function changetoSignupPageVendor(){
    document.querySelector("#loginPageVendor").classList.add("form--hidden");
    document.querySelector("#signupPageVendor").classList.remove("form--hidden");
}

function validate_email(email){
    if (email == '') {
      alert("Please enter some Email Address")
      log.action = ""
      return false
    }
    if (email.includes("@")) {
      return true
    }
    alert("Invalid Email Address")
    return false
}
function validate_password(inputpass)
{
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (inputpass.match(passw)) {
        return true;
    }
    else {
        alert("Invalid Password")
        return false;
    }
}

function validate_PhoneNumber(phoneNumber){
    var phoneno = /^\d{10}$/;
    if(phoneNumber.match(phoneno)){
        return true;
    } else {
        alert("Invalid Phone Number Entered");
        return false;
    }
}

function validateSigninVendor(){
    var signinEmail = document.getElementById("signinEmailIDVendor").value;
    if(!validate_email(signinEmail))return false;
    var signinPassword = document.getElementById("signinPasswordVendor").value;
    if(!validate_password(signinPassword))return false;
    fetch('/business/SignIn',{method:"POST",headers:{"Content-Type": "application/json",},body:JSON.stringify({
        password:signinPassword,
        email:signinEmail
    })}).then(res=>{
        if(res.status===400){
            alert("Email or Password Incorrect");
            return false;
        }
        res.json().then((body)=>window.location.assign(`/business/Page/${body.id}?password=${signinPassword}`))
        });
    return false;
}

function confirm_password(pass1, pass2){
    if(pass1===pass2){
        return true;
    } else {
        alert("Passwords do not match")
        return false;
    }
}
function validate_CIN(vendorCIN)
{
    cinNumber = '^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$';
    if(vendorCIN.match(cinNumber)){
        return true;
    } else {
        alert("Invalid CIN Number Entered");
        return false;
    }
}
function validateSignupVendor(){
    var signupEmail = document.getElementById("signupEmailIDVendor").value;
    if(!validate_email(signupEmail)) return false;
    var signupPass = document.getElementById("signupPasswordVendor").value;
    if(!validate_password(signupPass)) return false;
    var phoneNumber = document.getElementById("signupPhoneNumberVendor").value;
    if(!validate_PhoneNumber(phoneNumber)) return false;
    var confpass = document.getElementById("signupConfirmPasswordVendor").value;
    if(!confirm_password(signupPass, confpass)) return false;
    var vendorCIN = document.getElementById("signupCINVendor").value;
    if(!validate_CIN(vendorCIN)) return false;
    fetch('/business/SignUp',{method:"POST",headers:{"Content-Type": "application/json",},body:JSON.stringify({
        Name:document.getElementById("signupEnterpriseNameVendor").value,
        CIN:document.getElementById("signupCINVendor").value,
        password:signupPass,
        username:document.getElementById("signupUsernameVendor").value,
        phone:document.getElementById("signupPhoneNumberVendor").value,
        email:document.getElementById("signupEmailIDVendor").value,
    })}).then(res=>{
        if(res.status===400){
            alert(res.json().message);
            return false;
        }
        res.json().then((body)=>window.location.assign(`/business/Page/${body.id}?password=${signupPass}`))
        });
    return false;
}