//import { useState } from 'react'

import reactLogo from '../assets/react.svg'
import bootstrapLogo from '../assets/bootstrap-logo.svg'
import * as bootstrap from '../assets/js/bootstrap.esm.min.js'
import '../assets/css/bootstrap.min.css'
import '../assets/css/sign-in.css'

function Login() {
    return(
    	  <main class="form-signin w-100 m-auto">
      <form>
        <img
          class="mb-4"
          src={bootstrapLogo}
          alt=""
          width="72"
          height="57"
        />
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label for="floatingPassword">Password</label>
        </div>
        <div class="form-check text-start my-3">
          <input
            class="form-check-input"
            type="checkbox"
            value="remember-me"
            id="checkDefault"
          />
          <label class="form-check-label" for="checkDefault">
            Remember me
          </label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2017-2025</p>
      </form>
    </main>
    )
}

export default Login