function changetoLoginPage(){
    document.querySelector("#signupPage").classList.add("form--hidden");
    document.querySelector("#loginPage").classList.remove("form--hidden");
}
 
function changetoSignupPage(){
    document.querySelector("#loginPage").classList.add("form--hidden");
    document.querySelector("#signupPage").classList.remove("form--hidden");
}

function validate_email(email){
    if (email == '') {
      alert("Please enter some Email Address")
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

function validateSignin(){
    var signinEmail = document.getElementById("signinEmailID").value;
    if(!validate_email(signinEmail))return false;
    var signinPassword = document.getElementById("signinPassword").value;
    if(!validate_password(signinPassword))return false;
    fetch('/user/SignIn',{method:"POST",headers:{"Content-Type": "application/json",},body:JSON.stringify({
        password:signinPassword,
        email:signinEmail
    })}).then(async (res)=>{
        if(res.status===400){
            var body = await res.json();
            alert(body.message);
            return false;
        }
        var body = await res.json();
        window.location.assign(`/user/${body.id}?password=${signinPassword}`)});
}

function confirm_password(pass1, pass2){
    if(pass1===pass2){
        return true;
    } else {
        alert("Passwords Do not Match")
        return false;
    }
}

function validateSignup(){
    var signupEmail = document.getElementById("signupEmailID").value;
    if(!validate_email(signupEmail))return false;
    var signupPass = document.getElementById("signupPassword").value;
    if(!validate_password(signupPass))return false;
    var phoneNumber = document.getElementById("signupPhoneNumber").value;
    if(!validate_PhoneNumber(phoneNumber))return false;
    var confpass = document.getElementById("signupConfirmPassword").value;
    if(!confirm_password(signupPass, confpass))return false;
    fetch('/user/SignUp',{method:"POST",headers:{"Content-Type": "application/json",},body:JSON.stringify({
        password:signupPass,
        username:document.getElementById("signupUsername").value,
        phone:phoneNumber,
        email:signupEmail
    })}).then(async (res)=>{
        if(res.status===400){
            var body = await res.json()
            alert(body.message);
            return false;
        }
        res.json().then(body=>window.location.assign(`/user/${body.id}?password=${signupPass}`));
    return false;})     
}