let filterarray=[];
let filterer=[];

function b(){
    filterarray = gallaryarray.filter(function(b){
        var r=true
        filterer.forEach(element => {
            if(!b.tags.includes(element)) r=false; 
        }
        );
        return r;
    });
    if(filterarray.length === 0){
            document.getElementById("para").style.display ='block';
            document.getElementById("card").innerHTML="";
        }else{
            showgallary(filterarray);
            document.getElementById("para").style.display='none';
        }
}
var vis=false;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function visFil(){
    var filter = document.getElementById("fil")
    if(!vis){
        filter.style.visibility="visible";
        filter.style.animation="open 0.2s linear";
        filter.style.width="10em";
        vis=!vis;
    }
    else{   
        filter.style.animation="close 0.1s linear";
        filter.style.width="0";
        filter.style.visibility="hidden";
        vis=!vis;
    }
}
function updateButtons(){
    Array.prototype.forEach.call(document.getElementsByClassName("filb"), function(element) {
    if(filterer.includes(element.innerText))
    element.style.backgroundColor="wheat";
    else{
        element.style.backgroundColor="white";
    }
});}
function updateFilterer(text){
    
    if(filterer.includes(text)){
        filterer = filterer.filter((t)=>t!==text);
    }
    else{
        filterer.push(text);
    }
    updateButtons();
}
async function getBusinesses(){
    var s = document.getElementById("myinput").value;
    var r = document.getElementById("rateAbove").value;
    var body={}
    if(document.getElementById("zq").checked)body.zipcode=document.getElementById("zipcode").value;
    var events = filterer;
    console.log(events)
    const response = await fetch(`/business/getBusinesses?s=${s}&r=${r}`,{
        method: "POST", headers: { "Content-Type": "application/json", }, body:JSON.stringify({events, body})
    });
    const businesses = (await response.json()).businesses;
    
    document.getElementById("card").innerHTML= " ";
    businesses.forEach((element)=>{
        var stars = ''
        var index=0;
        for (index; index < Math.round(element.Rating) ; index++) {
                stars+=`<i class="fa fa-star" style="font-size: large;color: gold;"></i>`
        }
        for (index; index < 5; index++) {
                stars+=`<i class="fa fa-star" style="font-size: large;"></i>`
        }
        document.getElementById("card").innerHTML+=`
        <div onclick="window.location.assign('/business/${element._id}')" id="details" style="border: solid; border-width: 1px;border-color: #cccccc;border-radius: 1em;margin-bottom: 2em;">
        <div class="row">
        <div class="col-sm-5">
        <h3 class="m-3">
        ${element.Name}<br>
        </h3>
        <div style="padding-left: 1em;">
            <div
                style="display: inline;background-color: green;border-radius: 0.3em;color: aliceblue;font-size: large;padding: 0 0.2em;">
                ${Math.round(element.Rating*10) /10}
            </div>
            ${stars}
            ${element.nor} Ratings <a href="#" style="color: black;text-decoration: none;padding: 0.3em 0.4em;border-radius: 0.4em;">
            Click To rate</a>
        </div>
        <div style="padding: 1em;font-size: large;">
            <a style="background-color: rgb(67, 184, 223); color: aliceblue;text-decoration: none;padding: 0.3em 0.4em;border-radius: 0.4em;"
                href="mailto:<%=businessData.email%>"><i class="fa fa-envelope"></i> Mail</a>
            <div style="display: inline;margin-left: 0.5em;">
                ${element.addressm}
            </div>
            <p style="display: inline;color: grey;">
                
            </p>
            <button
            style="background:none;border:none; height: 2em;font-size: medium;width: 4em;border-radius: 0.4em;"><i class="fa fa-plus"></i></button>
        </div>
        </div>
        <div class="col-sm-5" style="padding:5em 0;">${element.desc.substring(0,200)}</div>
        </div>
        
    </div>`;
    });
}