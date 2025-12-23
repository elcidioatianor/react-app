import { useState } from "react";
import reactLogo from "../assets/react.svg";
import bootstrapLogo from "../assets/bootstrap-logo.svg";
import "./Dev.css";
import "./smask.css";
import "./Dev1";
 
export function Dev() {
    const [count, setCount] = useState(0);

    return (
        <>
			  <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
      <symbol id="bootstrap" viewBox="0 0 118 94">
        <title>Bootstrap</title>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z"
        ></path>
      </symbol>
      <symbol id="cpu-fill" viewBox="0 0 16 16">
        <path
          d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"
        ></path>
        <path
          d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z"
        ></path>
      </symbol>
	</svg>
            <header>
				{/*
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>*/}
				
                <div className="logo-container">
                    
                </div>
            </header>
 			
            <p className='read-the-docs'>Preencha os campos abaixo para criar a tua conta já</p>
				<div className="grid">
					{/*<div className="field--text">
                        <input className="field--text__input" id="name" type="text" placeholder="John Lewis" required minLength="3" maxLength="80" pattern="[A-Z][a-z-]+(\s[A-Z][a-z-]+)*"/>
                        <label className="field--text__label" htmlFor="name">Nome completo</label>
                    </div>*/}
             
                    <div className="field--text">
                        <input className="field--text__input" id="email" type="email" placeholder="john.lewis@gmail.com"
                                                                                                                                                required />
                        <label className="field--text__label" htmlFor="email">
                            Endereço de e-mail 
                        </label>
                    </div>

                   <div className="field--text">
                        <input className="field--text__input" id="password" type="password" minLength="6" maxLength="80" pattern="\S+"                                                                                             required />
                        <label className="field--text__label" htmlFor="password">
                            Código de acesso 
                        </label>
                    </div>
					{/*
					<div className="field--text">
                        <input className="field--text__input" id="repeatPassword" type="password" minlength="6" maxlength="80" pattern="\S+"                                                                                             required />
                        <label className="field--text__label" htmlFor="repeatPassword">
                            Confirmar código 
                        </label>
                    </div>*/}
				    <button onClick={() => setCount((count) => count + 1)}>
                    	Entrar
                	</button>
				</div>

            <div className="card">
            
                <p>
                    Não tens conta? Clique <a className='register-link' href='/login'>nesta ligação</a> para criar
                </p>
            </div>
            {/*<p className="read-the-docs">
                Se você não tem uma conta, pode abrir uma na secção abaixo 
            </p>*/}
        </>
    );
}

