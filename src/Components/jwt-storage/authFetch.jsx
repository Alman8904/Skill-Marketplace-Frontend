//adds jwt header at every auth endpoint 

//takes url as argument for other endpoints too
export async function authFetch(url, options = {}) {
    //get jwt token from local storage
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  //handles expired and unauth
  if(res.status===401 || res.status===403){
    localStorage.removeItem("token");
    window.location.reload();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
  let errorMessage = "Request failed";

  try {
    const errData = await res.json();
    errorMessage =
      errData.message ||
      errData.error ||
      JSON.stringify(errData);
    } catch {
      
    }

    throw new Error(errorMessage);
  }


  // for no response but success
  if(res.status===204){
    return null;
    }

    const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;

  
}
