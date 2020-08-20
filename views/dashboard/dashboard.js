/* globals feather:false */

(function () {
  'use strict';

  feather.replace();

  /* UI Functions */
  function hideTimeLineElement(id) {
    document.querySelector(`#${id}`).classList.add('d-none');
  }

  function showTimeLineElement(id) {
    document.querySelector(`#${id}`).classList.remove('d-none');
  }

  document.querySelector('.register_btn').addEventListener('click', (e) => {
    registerApp();
  });


  function registerApp() {
    let Headers = new Headers();
    Headers.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("app_name", document.querySelector('.app_name').value);
    urlencoded.append("app_callback", document.querySelector('.app_callback').value);

    var requestOptions = {
      //Change this to POST
      method: 'GET',
      headers: Headers,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("https://cdn.jsdelivr.net/gh/kabeer11000/sample-response/auth-sdk/reg.json", requestOptions)
        .then(response => response.json())
        .then(res => {
          if (res) {
            document.querySelector('client_public').value = res.client_public;
            document.querySelector('client_secret').value = res.client_secret;
            hideTimeLineElement('register_app');
            showTimeLineElement('app_credentials');
          }
        })
        .catch(error => console.log('error', error));
  }

})();
