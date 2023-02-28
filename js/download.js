function downloadmaterial(){
    document.getElementById("downloadmat").classList.add('disabled')
    let page = window.location.pathname.split("/").pop();
    
    let checkboxestex = document.getElementById("info-checkbox-textures").querySelectorAll('.info-checkbox');
    let checkboxesoth = document.getElementById("info-checkbox-other").querySelectorAll('.info-checkbox');
    let checkedboxestex = [];
    let checkedboxesoth = [];

    for (let i = 0; i < checkboxestex.length; i++) {
        if (checkboxestex[i].checked) {
            checkedboxestex.push(checkboxestex[i].id);
        }
    }
    for (let i = 0; i < checkboxesoth.length; i++) {
        if (checkboxesoth[i].checked) {
             checkedboxesoth.push(checkboxesoth[i].id);
        }
    }
    
    let selectedFiles = [];
    let selectedFileNames = [];

    for (let i = 0; i < checkedboxestex.length; i++) {
        selectedFiles.push("content/"+page.replace(".html", "")+"/"+openassetid+"/"+resspan.innerText+"_"+formatspan.innerText+"/"+openassetid+"_"+resspan.innerText+"_"+checkedboxestex[i]+"."+formatspan.innerText.toLowerCase());
        selectedFileNames.push(openassetid+"_"+resspan.innerText+"_"+checkedboxestex[i]+"."+formatspan.innerText.toLowerCase());
    }
    if(checkedboxesoth.length > 0){
        for (let i = 0; i < checkedboxesoth.length; i++) {
            selectedFiles.push("content/"+page.replace(".html", "")+"/"+openassetid+"/"+openassetid+checkedboxesoth[i]);
            selectedFileNames.push(openassetid+checkedboxesoth[i]);
        }
    }
    


    let zipFileName = openassetid+"_"+resspan.innerText+".zip";

    let xhrdata = {
        selectedFiles: selectedFiles.join("|"),
        selectedFileNames: selectedFileNames.join("|"),
        zipFileName: zipFileName
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./generate-zip.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status === 200) {
            let blob = this.response;
            let a = document.createElement('a');
            a.style = "display: none";
            a.href = window.URL.createObjectURL(blob);
            a.download = zipFileName;
            a.click();
            window.URL.revokeObjectURL(a.href);
        }
    };
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            document.getElementById("downloadmat").classList.remove('disabled')
            let xhr2 = new XMLHttpRequest();
            xhr2.open("POST", "./manage-cookies.php");
            xhr2.send();
        }
    };
    xhr.send(JSON.stringify(xhrdata));  
    
}


//function for calculating file size for images
function calculatefilesize(){
    let page = window.location.pathname.split("/").pop();
    let checkboxestex = document.getElementById("info-checkbox-textures").querySelectorAll('.info-checkbox');
    let checkedboxestex = [];
    let totalbytes = 0;

    // find out which checkboxes are checked and put them in a variable
    for (let i = 0; i < checkboxestex.length; i++) {
        if (checkboxestex[i].checked) {
            checkedboxestex.push(checkboxestex[i].id);
        }
    }

    // make http request for the file size and send the data to the next function
    let requests = 0;
    if(checkedboxestex.length > 0){
        for(let i = 0; i < checkedboxestex.length; i++){
            let xhr = new XMLHttpRequest();
            xhr.open('HEAD', "content/"+page.replace(".html", "")+"/"+openassetid+"/"+resspan.innerText+"_"+formatspan.innerText+"/"+openassetid+"_"+resspan.innerText+"_"+checkedboxestex[i]+"."+formatspan.innerText);
            xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                totalbytes += parseInt(xhr.getResponseHeader('Content-Length'), 10);
                requests++;
                if (requests === checkedboxestex.length) {
                    calculateotherfilesize(totalbytes);
                }
            }
            };
            xhr.send();
        }
    }
    else{
        updatesize(totalbytes2+totalbytes);
    }
    
}
// calculate file size for other files
function calculateotherfilesize(totalbytes) {
    let page = window.location.pathname.split("/").pop();
    let checkboxesoth = document.getElementById("info-checkbox-other").querySelectorAll('.info-checkbox');
    let checkedboxesoth = [];
    let totalbytes2 = 0

    for (let i = 0; i < checkboxesoth.length; i++) {
        if (checkboxesoth[i].checked) {
             checkedboxesoth.push(checkboxesoth[i].id);
        }
    }

    let requests = 0;
    if(checkedboxesoth.length > 0){
        for(let i = 0; i < checkedboxesoth.length; i++){
            let xhr = new XMLHttpRequest();
            xhr.open('HEAD', "content/"+page.replace(".html", "")+"/"+openassetid+"/"+openassetid+checkedboxesoth[i]);
            xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                totalbytes2 += parseInt(xhr.getResponseHeader('Content-Length'), 10);
                requests++;
                if (requests === checkedboxesoth.length) {
                    updatesize(totalbytes2+totalbytes);
                }
            }
            };
            xhr.send();
        }
    }
    else{
        updatesize(totalbytes2+totalbytes);
    }
    
}
// calculate the final size and set it to the "info-file-size" element
function updatesize(bytesum){
    document.getElementById("info-file-size").innerHTML = (bytesum * 0.00000095367432).toFixed(2)+" mb"
}