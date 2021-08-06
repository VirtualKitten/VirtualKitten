// Start Clock refresh

// uses new new Ajax.PeriodicalUpdater( 
// in main fetch file to trigger the auto update of the page.
// Written by Denise Rose

var gUpdateDiv="";
var gContentURL="";
var gcheckInterval=0;
var gcheckURL = "";
var gCurrentCheck  ="";





_fetchUpdater('track_data','/fetch_sql.php','/fetch_sql.php',60000);
// 60000 = 1 minute in ms


function _fetchUpdater(updateDiv,contentURL,checkURL,checkInterval)
{
    gUpdateDiv = updateDiv;
    gContentURL = contentURL;
    gcheckInterval = checkInterval;
    gCheckURL = checkURL;
    
    setTimeout('Check();',gcheckInterval);
}

//Called by _fetchUpdater every (n) seconds  determines if content should be updated as page loaded.
function Check()
{
   new Ajax.Request(gCheckURL,{method:'get',  onSuccess:CheckResponse});
   setTimeout('Check();',gcheckInterval);
}



// looks for the response and determines if the div should be updated. 
function TryFetchit(file) {
     fetch('/images/nowplaying_artwork_2.png')
     .then(response => response.text())
     .then(data => {
  	// Do something with your data
  	//console.log(data);
  	return data;
     });
}

const getBlobFromUrl = (myImageUrl) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', myImageUrl, true);
        request.responseType = 'blob';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = reject;
        request.send();
    });
};
const getDataFromBlob = (myBlob) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(myBlob);
    });
}
const convertUrlToImageData = async (myImageUrl) => {
    try {
        let myBlob = await getBlobFromUrl(myImageUrl);
        console.log(myBlob);
        let myImageData = await getDataFromBlob(myBlob);
        console.log(myImageData);
        return myImageData;
    } catch (err) {
        console.log(err);
        return null;
    }
};

function openFileOrig() {
   var base64; 
   var r;
   try {
       r = fopen('/images/nowplaying_artwork_2.png', 'wb');
        if (r !== false) {
             fread(r,base64);
             if (base64) base64 = base64_encode(base64);
        }
      
    } catch (err) {
       if(r) fclose($r);
       console.log(err);
       return null;
    }
    
}
function openFileOrig2(file) {
   var base64; 
   var r;
   var img_src;
   
   try {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
          img_src = event.target.result;
          // We do something
          if (img_src) base64 = base64_encode(img_src);
        });
        
       reader.addEventListener('progress', (event) => {
       if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progress: ${Math.round(percent)}`);
       }});
       reader.readAsDataURL(file);
    } catch (err) {
    
       console.log(err);
       return null;
    }
}

var openFile = function(event) {
    var input = event.target;

    try {
       var reader = new FileReader();
        reader.onload = function(){
          var img_src = reader.result;
          // We do something
          if (img_src) base64 = base64_encode(img_src);

        };
        reader.readAsText(input);
    } catch (err) {
            console.log(err);
            return null;
    }    
};



function CheckResponse(transport)
{
    var content = transport.responseText;
    try {
        var file = new File([blob], "/images/nowplaying_artwork_2.png",{type:"image/png", lastModified:new Date().getTime()})
    } catch (err) {
            console.log(err);
            return null;
    }    
    //FILE.target = '/images/nowplaying_artwork_2.png';
    //FILE.files = FILE.target;
    //var base64file1 = openFile(file);
    var base64file1 = TryFetchit('/images/nowplaying_artwork_2.png');
    //var base64file1 = openFileOrig();
    base64file1 = base64_encode(base64file1);
    var base64file2 =  $('outerimg').$('#np_track_artwork').src.value;

    if(base64file1 != base64file2) {
    
    //if(gCurrentCheck != content) {
       
      gCurrentCheck = content;
       
      new Ajax.Request(gContentUrl, {method: 'get',onSuccess:function t() { 
         $(gUpdateDiv).innerHTML = t.responseText; /*t.response.json()*/}
        
        
      });
      
      $time = new Date().getTime();
      new Ajax.Request('outer_img', {method: 'get',onSuccess:function s() { 
         $('outer_img').innerHTML = "<img id='#np_track_artwork' src='/images/nowplaying_artwork_2.png?t='"+$time+" alt='Playing track artwork' width='200' height='200'>"}
          
      });
           
    }
    //setTimeout('Check();',gcheckInterval);
}
