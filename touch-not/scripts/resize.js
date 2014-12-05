var resizedPhotos = [];
jQuery(document).ready(function($) {
  $('#downloadLink').hide();
 
  $('body').on('click','#downloadLink', downloadAllPhotos);

  $('#selectedFiles').change(loadSelectedFiles);
  


});

function showDownloadLink(show){
  if(show){
    $('#downloadLink').show();
  }
}

function downloadAllPhotos(){
     for (var i = 0; i < document.getElementsByClassName("btnPhotoDownload").length; i++){   
    
          var clickEvent = document.createEvent("MouseEvent");
        clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
            document.getElementsByClassName("btnPhotoDownload")[i].dispatchEvent(clickEvent);
      }
     return false;
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
        
        showPhotoPreview(dataURL, getPhotoName(photo.name));
        resizedPhotos.push({ url: dataURL, name: photo.name});
        reader.abort();
        showDownloadLink(isLastPhoto);
      }
 
   }
   reader.readAsDataURL(photo);
   
  }

  function getPhotoName(photoName){
      photoName = escape(photoName);
      var photoTypes = ['.png', '.jpeg', '.gif' ];
      var newType = '.jpg';
      for (var i = 0; i < photoTypes.length; i++) {
        var photoType = photoTypes[i];
        photoName = photoName.replace(photoType, newType);
      };
      return photoName;
  }

  function showPhotoPreview(dataURL, photoName){
    var photoHtml = '<div class="photo-container">'
                    +'<div class="photo-wrap">'
                    +'<img src="' + dataURL + '" title="'+ escape(photoName) +'" '
                    +'alt="'+ escape(photoName) +'"/>'
                    +'</div>';
    photoHtml +='<a href="'+ dataURL +'" class="btn btn-default btnPhotoDownload" download="'+ photoName +'">'
              + '<i class="glyphicon glyphicon-download-alt"></i> '
              + ' Download </a>';
    photoHtml +='</div>';
    $('#photosInfoOutput').append(photoHtml);

  }

