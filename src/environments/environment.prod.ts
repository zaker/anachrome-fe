
export const environment = {
  production: true,
  api_address: document.head.querySelector("[property~=apiUrl][content]")
                   .getAttribute("content")
};
