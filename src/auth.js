const saveToken = (user) => {
  localStorage.setItem('token', user.accessToken);
  localStorage.setItem('tokenTime', new Date().getTime().toString());

  localStorage.setItem('username', user.username);
  localStorage.setItem('email', user.email);
  localStorage.setItem('userId', user.id);
};

const getToken = () => {
  let token = localStorage.getItem('token');
  let tokenTime = localStorage.getItem('tokenTime');

  if (token !== null && tokenTime !== null) {
    let currentDate = new Date().getTime();
    let tokenDate = parseInt(tokenTime);
    let diff = 0;
    if (tokenDate !== null) diff = currentDate - tokenDate;

    if (diff > 86400000) {
      console.log('The token has expired.');
      logout();
      token = null;
      window.location.href = '/';
    }
  }
  return token;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTime');

  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('userId');

  window.location.href = '/';
};

const isLogged = () => {
  return getToken() !== null;
};

const auth = {
  saveToken: saveToken,
  getToken: getToken,
  logout: logout,
  isLogged: isLogged,
};

export default auth;
