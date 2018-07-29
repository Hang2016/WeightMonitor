import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  images = [];
  constructor(public navCtrl: NavController,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private file: File,
    private platform: Platform,
    private photoViewer: PhotoViewer) {
    this.platform.ready().then(() => {
      this.file.listDir(this.file.externalDataDirectory, 'img').then(results => {
        this.images = [];
        // console.log(JSON.stringify(results));

        results.forEach(image => {
          const imageUrl = image.nativeURL;
          const imagePath = this.getFilePathFromFileUri(imageUrl);
          const imageName = this.getFileNameFromFileUri(imageUrl);
          this.images.push({
            url: imageUrl,
            path: imagePath,
            name: imageName
          })
        });

      }).catch(err => console.log(JSON.stringify(err)))
    })
  }
  viewPhoto(image) {

    this.photoViewer.show(image.url, image.name);

  }
  addPhotos() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 31,
      quality: 100,
    }
    this.imagePicker.hasReadPermission().then(result => {
      if (result) { // read permission granted
        this.imagePicker.getPictures(options).then((results) => {
          for (var i = 0; i < results.length; i++) {
            const imagePath = results[i];
            const fileName = this.getFileNameFromFileUri(imagePath);
            const filePath = this.getFilePathFromFileUri(imagePath);

            const newFileName = this.parseFileName(fileName);
            const newFilePath = this.file.externalDataDirectory + '/img';

            this.file.createDir(this.file.externalDataDirectory, 'img', false).then(res => {
              console.log('folder created : ' + JSON.stringify(res));
              //folder created'
              this.moveFile(filePath, fileName, newFilePath, newFileName);
            }).catch(err => {
              // folder exists
              console.log('folder exists : ' + JSON.stringify(err));
              this.moveFile(filePath, fileName, newFilePath, newFileName);
            })
          }
        });
      } else { // request read permission
        this.imagePicker.requestReadPermission();
      }
    })

  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      cameraDirection: this.camera.Direction.BACK
    }
    this.camera.getPicture(options).then(imagePath => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      const fileName = this.getFilePathFromFileUri(imagePath);
      const filePath = this.getFilePathFromFileUri(imagePath);
      console.log('file name == ' + fileName);
      console.log('file path == ' + filePath);

      const newFileName = this.generateFileName();
      const newFilePath = this.file.externalDataDirectory + '/img';
      console.log('new file name == ' + newFileName);
      console.log('new path name == ' + newFilePath);

      this.file.createDir(this.file.externalDataDirectory, 'img', false).then(res => {
        console.log('folder created : ' + JSON.stringify(res));
        //folder created'
        this.moveFile(filePath, fileName, newFilePath, newFileName);
      }).catch(err => {
        // folder exists
        console.log('folder exists : ' + JSON.stringify(err));
        this.moveFile(filePath, fileName, newFilePath, newFileName);
      })
    }, (err) => {
      console.log('Failed to take picture : ' + JSON.stringify(err));
    });
  }
  private getFileNameFromFileUri(fileUri: string) {
    return fileUri.substr(fileUri.lastIndexOf('/') + 1);
  }
  private getFilePathFromFileUri(fileUri: string) {
    return fileUri.substr(0, fileUri.lastIndexOf('/') + 1);
  }
  // Create a new name for the image
  private generateFileName() {
    const date = new Date();
    const newFileName = date.toLocaleDateString().trim().replace(/\//g, '-') + ".jpg";
    return newFileName.replace;
  }
  private parseFileName(fileName) {
    var dateStr = fileName.split('_')[1];

    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6) - 1;
    var day = dateStr.substring(6, 8);

    var date = new Date(year, month, day);
    const newFileName = date.toLocaleDateString().trim().replace(/\//g, '-') + ".jpg";
    return newFileName;
  }
  private moveFile(filePath, fileName, newFilePath, newFileName) {
    this.file.moveFile(filePath, fileName, newFilePath, newFileName).then(res => {
      console.log('successfully move file to the new location');
      this.images.push({
        url: newFilePath + newFileName,
        name: newFileName,
        path: newFilePath
      })
    }).catch(err => console.log('Failed to move file to the new location'));
  }
  test() {
    // this.file.removeDir(this.file.dataDirectory, 'img').then(res => {
    // }).catch(err => console.log(JSON.stringify(err)));
    console.log('documentsDirectory == ' + this.file.documentsDirectory);
    console.log('applicationDirectory == ' + this.file.applicationDirectory);
    console.log('applicationStorageDirectory == ' + this.file.applicationStorageDirectory);
    console.log('cacheDirectory == ' + this.file.cacheDirectory);
    console.log('dataDirectory == ' + this.file.dataDirectory);
    console.log('externalApplicationStorageDirectory == ' + this.file.externalApplicationStorageDirectory);
    console.log('externalDataDirectory == ' + this.file.externalDataDirectory);
    console.log('sharedDirectory == ' + this.file.sharedDirectory);
    this.file.listDir(this.file.dataDirectory, 'img').then(results => {
      console.log(JSON.stringify(results));
    }).catch(err => console.log(JSON.stringify(err)))
  }
}
