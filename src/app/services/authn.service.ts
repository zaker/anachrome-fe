import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class AuthnService {
  constructor() {}
  /**
   * auth
   */
  public async auth(): Promise<void> {
    const request = await fetch("...");
    const response = navigator.credentials.create(await request.json());
    await fetch("...", {method: "POST", body: JSON.stringify(response)});
  }

  private async verifyAssertionWithServer(assertedCredential: any):
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

    let response;
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
      console.log("Error doing assertion");
      console.log(response.errorMessage);
      // showErrorAlert(response.errorMessage);
      return;
    }
  }
}
