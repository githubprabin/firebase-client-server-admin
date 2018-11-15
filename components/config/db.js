import Firebase from 'firebase';

let config = {
  apiKey: "AIzaSyC4QyrkpozJVWbSoo80olKJEZ7e_9CEJ4M",
  authDomain: "445049730699-g23uqqi2sftv8imuja9rd3redujaci16.apps.googleusercontent.com",
  databaseURL: "https://client-server-notification.firebaseio.com",
  projectId: "client-server-notification",
  storageBucket: "client-server-notification.appspot.com",
  messagingSenderId: "445049730699"
};
let app = Firebase.initializeApp(config);
export const db = app.database();