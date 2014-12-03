var resizedPhotos = [];
jQuery(document).ready(function($) {
  $('#downloadLink').hide();
  //$('#downloadLink').click();


 
      $('#selectedFiles').change(loadSelectedFiles);
  


});

function showDownloadLink(show){
  if(show){
    $('#downloadLink').show();
  }
}




function loadSelectedFiles(evt) {
   if (window.File && window.FileReader && window.FileList && window.Blob) {
        var files = evt.target.files; // FileList object
        for (var i = 0, f; f = files[i]; i++) {
          isLastPhoto = (i + 1) == files.length ? true : false;
          resizePhoto(f, isLastPhoto);
        }

    } else {
    alert('Error: The File APIs are not fully supported in this browser. Try new versions of Google Chrome or Firefox.');
  }

}

function resizePhoto(photo, isLastPhoto){
    if (!photo.type.match('image.*')) {
        showDownloadLink(isLastPhoto);
        return;
    }
    var reader = new FileReader();

    reader.onloadend = function() {
 
        var tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload = function() {
 
        var MAX_WIDTH = 720;
        var MAX_HEIGHT = 540;
        var tempW = tempImg.width;
        var tempH = tempImg.height;

        steps = Math.ceil(Math.log(tempW / MAX_WIDTH) / Math.log(2));
        console.log('Number of steps: ',steps);

        if (tempW > tempH) {
            if (tempW > MAX_WIDTH) {
               tempH *= MAX_WIDTH / tempW;
               tempW = MAX_WIDTH;
            }
        } else {
            if (tempH > MAX_HEIGHT) {
               tempW *= MAX_HEIGHT / tempH;
               tempH = MAX_HEIGHT;
            }
        }
 
        var canvas = document.createElement('canvas');
        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, tempW, tempH);
        var dataURL = canvas.toDataURL("image/jpeg");
        
          var imgDiv = document.createElement('div');
            imgDiv.innerHTML = ['<img class="img-thumbnail" src="', dataURL,
                              '" title="', escape(photo.name), '"/>'].join('');
          document.getElementById('photosInfoOutput').insertBefore(imgDiv, null);
        

        resizedPhotos.push({ url: dataURL, name: photo.name});
        reader.abort();
        showDownloadLink(isLastPhoto);
      }
 
   }
   reader.readAsDataURL(photo);
   
  }

