function ham() {
  document.getElementById("navBar").style.visibility = "visible";
  document.getElementById("navBar").style.animation = "openNav 0.2s linear";
  document.getElementById("navBar").style.width = "min(85vw,25em)";
}
function closeNav() {
  console.log("hello");
  document.getElementById("navBar").style.animation = "closeNav 0.2s linear";
  setTimeout(() => {
    document.getElementById("navBar").style.visibility = "hidden";
    document.getElementById("navBar").style.width = "0";
  }, 200);
}

async function logout(){
  await fetch("/logout");
  window.location.assign("/");
}

function openCollection(){
  
}