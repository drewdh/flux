enum Action {
  InitiateAuth = 'INITIATE_AUTH',
  SetPassword = 'SET_PASSWORD',
}

class UserAuth {
  private _isAuthenticated: boolean = false;

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  async signIn(request: { email: string; password: string }): Promise<any> {
    const resp = await fetch(`https://api.drewhanberry.com/auth/?action=${Action.InitiateAuth}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(request),
    });
    const json = await resp.json();
    if (!resp.ok) {
      throw new Error(json.message);
    }
    this._isAuthenticated = true;
    return json;
  }

  async setNewPassword(request: {
    email: string;
    password: string;
    session: string;
    name: string;
  }): Promise<any> {
    const resp = await fetch(`https://api.drewhanberry.com/auth/?action=${Action.SetPassword}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(request),
    });
    const json = await resp.json();
    if (!resp.ok) {
      throw new Error(json.message);
    }
    return json;
  }

  async signOut() {
    try {
      this._isAuthenticated = false;
    } catch (e) {}
  }
}

const userAuth = new UserAuth();
export default userAuth;
