import {useId} from 'react';
import { useFormStatus } from 'react-dom';

//import reactLogo from '../assets/react.svg'
import bootstrapLogo from '../assets/bootstrap-logo.svg'
//import * as bootstrap from '../assets/js/bootstrap.esm.min.js'
import '../assets/css/bootstrap.min.css'
import '../assets/css/profile.css'

//import {submitForm} from '../assets/js/signin.js'

function ListItem({user}) {
	return (
		<>
		</>
	)
}


const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
	email: "heidy.lamarr@gmail.com",
  imageSize: 90,
};

export default function Profile() {
  return (
    <main className="form-signin w-100 m-auto">
      <img className="avatar mb-4" src={/*user.imageUrl*/bootstrapLogo} alt={'Photo of ' + user.name} style={{ width: /*user.imageSize*/72, height: /*user.imageSize*/57 }}/>
		
		<h1 className="h3 mb-3 fw-normal">Olá, {user.name}</h1>

		<div className="list-group my-3">
			<div className="list-group-item">Nome: <strong>{user.name}</strong></div>
			<div className="list-group-item">Email: <strong>{user.email}</strong></div>
		</div>
		<div className="my-3">
			<button className="btn btn-primary"> Terminar sessão </button>
		</div>
		
    </main>
  );
}
