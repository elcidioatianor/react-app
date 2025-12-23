import * as smask from "./smask.es";
import {Validator} from './validator'

// Load input mask via js
let el = document.getElementById("cpf");
console.log(el)

//smask.input(el, ["ddd.ddd.ddd-dd"]);
/*smask.input(document.getElementById("cpfcnpj"), [
  "ddd.ddd.ddd-dd",
  "dd.ddd.ddd/dddd-dd",
]);*/

// Initialize mask on inputs that have data-mask attribute
//smask.prepareMaskInputs();

document.querySelectorAll('input')
    .forEach(input => {
        new Validator(input, {
            minlength: "Digite pelo menos #{length} caracteres",
            pattern: "Formato incorrecto",
            required: "Este campo não pode estar vazio",
            maxlength: "O texto não deve exceder #{length} caracteres"
        });
    }) 