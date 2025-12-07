import {useId} from 'react';
import { useFormStatus } from 'react-dom';

//import reactLogo from '../assets/react.svg'
import bootstrapLogo from '../assets/bootstrap-logo.svg'
//import * as bootstrap from '../assets/js/bootstrap.esm.min.js'
import '../assets/css/bootstrap.min.css'
import '../assets/css/register.css'

//import {submitForm} from '../assets/js/signin.js'

function Email({fieldId}) {//the id prop will be passed as attribute
	return (
		<div className="form-floating">
		  <input type="text" className="form-control" name="username" id={fieldId} placeholder="Exemplo: johndoe"/>
          <label htmlFor={fieldId}>Nome de usuário</label>
		</div>
	)
}

function Password({fieldId}) {
	return (
		<div className="form-floating">
		  <input type="password" className="form-control" name="password" id={fieldId} placeholder="Palavra-passe"/>
          <label htmlFor={fieldId}>Palavra-passe</label>
		</div>
	)
}

function Submit() {
    //{pending, data: FormData, method, action: Function/String}
    let {pending} = useFormStatus() //no arguments

    return (
        <button disabled={pending} className="btn btn-primary w-100 py-2">
            {pending ? "Aguarde..." : "Cadastrar-se"}
        </button>
    )
}

//extract Form component
function RegisterForm() {
	function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

	let jsonForm = Object.fromEntries(formData.entries());
    // You can pass formData as a fetch body directly:
    fetch('http://localhost:3000/auth/register', {
		method: form.method,
		headers:{'Content-Type': 'application/json'},
		body: JSON.stringify(jsonForm) 
	})
		.then(res=>{
			res.json().then(res.ok ? console.log : console.error)
		})
		.catch(err=>{console.error(err)});

    // Or you can work with it as a plain object:
    //const formJson = Object.fromEntries(formData.entries());
    //console.log(formJson);
  }
	let nameId = useId();
	let passwdId = useId();

	return (
		<form method="post" action="/auth/register" onSubmit={handleSubmit}>
        <img className="mb-4" src={bootstrapLogo} alt="" width="72" height="57"/>

        <h1 className="h3 mb-3 fw-normal">Iniciar sessão</h1>

       
      	<Email fieldId={nameId}/>
			<Password fieldId={passwdId}/>

        <div className="form-check text-start my-3">
          <input className="form-check-input" type="checkbox" value="checkDefault" name="checkDefault" id="checkDefault" defaultChecked={false}/>
          <label className="form-check-label" htmlFor="checkDefault">Guardar meus dados</label>
        </div>

        <Submit/>

        <p className="mt-5 mb-3 text-body-secondary">&copy; 2017-2025 | Losertech Inc.</p>
        </form>
	)
}
//inside form, extract each input into a component

function Register() {
    return(
		<main className="form-signin w-100 m-auto">
			<RegisterForm/>
		</main>
    )
}


export default Register