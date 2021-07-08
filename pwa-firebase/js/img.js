//https://labs.madisoft.it/javascript-image-compression-and-resizing/
const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/png";
const QUALITY = 0.7;

const calculateSize = (img, maxWidth, maxHeight) => {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

//https://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript
const blobToFile = (theBlob, fileName, fileType) => {
    //A Blob() is almost a File() - it's just missing the three properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    theBlob.type = fileType;
    return theBlob;
}