export class Validator {
    constructor(input, options = {}) {
        let feedback = input.parentElement.querySelector('.feedback')

        if (!feedback) {
            feedback = input.parentElement.appendChild(document.createElement('div'))
            feedback.classList.add('feedback')
        }

        let property = [
            ['required', 'valueMissing'],
            ['min', 'rangeUnderflow'],
            ['max', 'rangeOverflow'],
            ['minlength', 'tooShort'],
            ['maxlength', 'tooLong'],
            ['pattern', 'patternMismatch']
        ];
        
        input.addEventListener("input", (evt) => {
            let inputValidity = input.validity;
            let value = input.value;
            
            console.log(input)

            if (!input.checkValidity()) {
                //let errorText = input.validationMessage;
                
                for (let [attr, prop] of property) {
                    
                        if (attr in options) {
                    if (inputValidity[prop]) {
                    
                            let errorText = typeof options[attr] == 'string'
                                ? options[attr]
                                    .replace(/\#\{value\}/g, value)
                                    .replace(/\#\{length\}/, value.length)
                                : options[attr](value);
                        feedback.textContent = errorText;
                        break;
                        }
                        
                    }
                }
                feedback.style.display = 'block'
                input.classList.add('invalid')
            } else {
                input.classList.remove('invalid')
                feedback.style.display = 'none'
            }
        })
    }
}

