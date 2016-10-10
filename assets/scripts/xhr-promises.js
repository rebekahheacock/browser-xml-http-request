'use strict';

const getFormFields = require('../../lib/get-form-fields');

$(() => {
  // // console methods require `this` to be `console`
  // // promise function are called with `this === undefined`
  // let clog = console.log.bind(console);
  // let elog = console.error.bind(console);

  const baseUrl = 'http://localhost:3000';

  const onError = (error) => {
    console.error(error);
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

  // signUpOrIn returns a promise
  // signIn returns signUpOrIn(), which returns a promise

  const signUpOrIn = (credentials, path) =>
    new Promise((resolve, reject) => {
      // promise is implicitly returned because you're using
      // a fat arrow function with no { }
      // resolve and reject replace success and failure handlers
      // no longer define explicitly
      // let promise maintain the callback chain instead
      // when using promises: resolve takes replace of initial success callback
      // reject takes place of initial failure callback
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // can't resolve promise until load event fires
          // that's what makes it asynchronous
          // load gives us the necessary data to resolve the promise
          resolve(xhr.response);
        } else {
          reject(xhr);
        }
      });
      xhr.addEventListener('error', () => reject(xhr));
      xhr.open('POST', baseUrl + path);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(credentials));
    });

  // don't have to pass onFulfilled or onRejected
  // promises make things cleaner!
  const signIn = (credentials) => signUpOrIn(credentials, '/sign-in');

  const signUp = (credentials) => signUpOrIn(credentials, '/sign-up');

  const submitHandler = (event) => {
    // // console methods require `this` to be `console`
    // // promise functions are called with `this === undefined`
    // let clog = console.log.bind(console);
    // let elog = console.error.bind(console);
    // not necessarily saving lines of code here, but:
      // shortening all function signatures
      // improving clarity: everything reads in order it executes even though it's async
      // allowed to do this b/c promises give us future values
      // future values allow us to queue functions that will execute when those values resolve
    event.preventDefault();
    let data = getFormFields(event.target);
    signUp(data)
    .then(onSignUp)
    .then(() => signIn(data)) // passing original data, not response, here. also passing a function, not a function invocation
    .then(onSignIn)
    .catch(onError);
  };

  // () => signIn(data) is the same as
  // function () {
  //   return signIn(data);
  // }

  $('#sign-up-promise').on('submit', submitHandler);
});
