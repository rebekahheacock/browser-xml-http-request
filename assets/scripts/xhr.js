'use strict';

// TO SUM UP
// this is callback hell
// keep bouncing back and forth; chain is unclear

const getFormFields = require('../../lib/get-form-fields');

// jQuery shorthand for $(document).ready
$(() => {
  const baseUrl = 'http://localhost:3000';

  // error handler
  const onError = (error) => {
    console.error(error);
  };

  // more handlers
  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  // will sign up OR sign in
  // two requests only differ by the URL path
  // onFulfilled: success handler
  // onRejected: failure handler
  const signUpOrIn = (credentials, path, onFulfilled, onRejected) => {
    // XMLHttpRequest is a constructor function: capital letter, "new", invoked()
    // creating request object does not initiate request
    // request object doesn't (by default) have what it needs to make request
    let xhr = new XMLHttpRequest();

    // 'load' is listening for response from server
    xhr.addEventListener('load', () => {
      // status range 200-299: success
      if (xhr.status >= 200 && xhr.status < 300) {
        // response is whatever comes back from server
        // can parse it here (if it's JSON) or parse it in your handler
        // can do whatever you want before passing it on to onFulfilled
        onFulfilled(xhr.response);
      } else {
        // fire failure handler
        // pass it the entire request object (xhr)
        // pass the entire object so we can handle things different in different cases
        // e.g., bad request vs good request that wasn't authorized vs wrong URL
        onRejected(xhr);
      }
    });

    // if there's an error for any non-status-code reason
    // errors that occur before request is made
      // note that bad data will mean we get back a "bad" status code
      // other bad things can happen too, though:
      // ex: forget to set client origin
        // browser generates CORS-related errors
        // before it fires AJAX request, it fires an options request
        // open up network inspector to see this
        // server responds with what actions are allowed on domain
        // errors here aren't about response status for request
    // this is clunky: we're handling errors in multiple places.
    xhr.addEventListener('error', () => onRejected(xhr));

    // start request
    xhr.open('POST', baseUrl + path);
    // have to set request header to accept json
    xhr.setRequestHeader('Content-Type', 'application/json');
    // make request/send data
    // have to send as JSON, not object
    xhr.send(JSON.stringify(credentials));
  };

  // uses path for sign in
  // "method delegation": applying static data to method
  // might be related to "partial application," but that's something for functional programming experts
  // in Ruby: "method dispatch"
  const signIn = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulfilled, onRejected);

  // uses path for sign up
  const signUp = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulfilled, onRejected);

  const submitHandler = (event) => {
    event.preventDefault();
    let data = getFormFields(event.target);

    // auto sign in!
    const onSignUpSuccess = function (response) {
      // original success handler defined above
      onSignUp(response);
      // let's do other stuff, too!
      // "callback chain"
      signIn(data, onSignIn, onError);
    };

    // this is the important part of the submitHandler function
    signUp(data, onSignUpSuccess, onError);
  };

  // attach handler to sign up form
  $('#sign-up').on('submit', submitHandler);
});
