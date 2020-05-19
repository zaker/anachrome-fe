import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({ providedIn: 'root' })
export class AuthnService {
  constructor(private apiService: ApiService) { }
  /**
   * auth
   */
  public async auth(): Promise<void> {
    try {
      const creds = await this.fetchServerCredentials();
      await this.verifyCredentialsWithServer(creds)
    } catch (error) {
      console.error(error)
    }
  }

  private async fetchServerCredentials(): Promise<any> {
    // prepare form post data
    var formData = new FormData();
    // formData.append('username', username);

    // send to server for registering
    let makeAssertionOptions: { status: string; errorMessage: any; challenge: Uint8Array; allowCredentials: any[]; };
    try {
      var res = await this.apiService.fetch('/assertionOptions', {
        method: 'POST',  // or 'PUT'
        body: formData,  // data can be `string` or {object}!
        headers: { 'Accept': 'application/json' }
      });

      makeAssertionOptions = await res.json();
    } catch (e) {
      console.error("Request to server failed", e);
    }

    console.log("Assertion Options Object", makeAssertionOptions);

    // show options error to user
    if (makeAssertionOptions.status !== "ok") {
      console.log("Error creating assertion options");
      console.log(makeAssertionOptions.errorMessage);
      console.error(makeAssertionOptions.errorMessage);
      return;
    }

    // todo: switch this to coercebase64
    const challenge =
      (makeAssertionOptions.challenge.toString()).replace(/-/g, "+").replace(/_/g, "/");
    makeAssertionOptions.challenge =
      Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

    // fix escaping. Change this to coerce
    makeAssertionOptions.allowCredentials.forEach(function (listItem) {
      var fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
      listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
    });

    console.log("Assertion options", makeAssertionOptions);



    // ask browser for credentials (browser will ask connected authenticators)
    return await navigator.credentials.get({ publicKey: makeAssertionOptions })
  }

  private async verifyCredentialsWithServer(assertedCredential: any):
    Promise<void> {
    let authData =
      new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON =
      new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    let userHandle = new Uint8Array(assertedCredential.response.userHandle);
    const data = {
      id: assertedCredential.id,
      rawId: coerceToBase64Url(rawId),
      type: assertedCredential.type,
      extensions: assertedCredential.getClientExtensionResults(),
      response: {
        authenticatorData: coerceToBase64Url(authData),
        clientDataJSON: coerceToBase64Url(clientDataJSON),
        userHandle: userHandle !== null ? coerceToBase64Url(userHandle) : null,
        signature: coerceToBase64Url(sig)
      }
    };

    let response: any;
    try {
      let res = await fetch("/makeAssertion", {
        method: 'POST',              // or 'PUT'
        body: JSON.stringify(data),  // data can be `string` or {object}!
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      response = await res.json();
    } catch (e) {
      // showErrorAlert("Request to server failed", e);
      throw e;
    }

    console.log("Assertion Object", response);

    // show error
    if (response.status !== "ok") {
      console.error("Error doing assertion", response.errorMessage);

      return;
    }
  }
}
