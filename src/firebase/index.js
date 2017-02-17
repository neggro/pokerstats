import firebase from 'firebase';

var config = {
    apiKey: 'AIzaSyDrxBwqcInPzfdU-rmXy8BfuwQ-7r2dmN8',
    authDomain: 'poker-stats-9931f.firebaseapp.com',
    databaseURL: 'https://poker-stats-9931f.firebaseio.com',
    storageBucket: 'poker-stats-9931f.appspot.com',
    messagingSenderId: '434636272352'
};

firebase.initializeApp(config);

export default firebase;
