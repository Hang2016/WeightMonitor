import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {

  constructor(public navCtrl: NavController,
    private imagePicker: ImagePicker,
    private camera: Camera) {

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
            console.log('Image URI: ' + results[i]);
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
      allowEdit: true,
      saveToPhotoAlbum: true,
      cameraDirection: this.camera.Direction.BACK
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
