//import "../assets/css/bootstrap.min.css";

import {useState} from 'react';

function MyButton() {
    /***
     * Updating the screen (pasding a state to components)
     * We can pass any object to useState, it'll be returned
     * as the first element in the destructured array from useState
     * The object can be updated by calling setState, the second
     * element (we can give any name to these variables that best
     * describe them in our use case)
     *
     */
    let [count, setState] = useState(0); //0 is our initial object

    /***
     * Responding to events: 
     * - No parents in the event attribute
     * - onClick in JSX (not onclick)
     *
     */
    function handleClick() {
        //alert('You clicked me');
        //Update our object when an action occurs:
        setState(count + 1)
    }

    return (
        <button className="btn btn-primary" onClick={handleClick}>
            Clicked {count} times
        </button>
    )
}
/***
 * Conditionally rendering components
 */
function LoginForm() {
    return (
        <>
        </>
    )
}

function AdminPannel() {
    return (
        <>
        </>
    )
}

function ConditionallyRender() {
    let content;
    let isLoggedIn = false;

    if (isLoggedIn) {
        content = <AdminPanel />;
    } else {
        content = <LoginForm />;
    }

    return (
        <div>
            {content}
        </div>
    );

    /**
     * Using ternary operator:
     *
     * <div>
     *    {isLoggedIn ? (
     *        <AdminPanel />
     *     ) : (
     *        <LoginForm />
     *    )}
     *  </div>
     *
     */
}

/***
 * Rendering lists: add 'key' to uniquely identify list items
 */
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}



export default function Learn() {
    return(
        <div className="container">
            <h1>Welcome to my App</h1>
            /***
             * We can render the button any times, each button will
             * have its own state. If we want all instances to share the same state,
             * then we should move our state to the parent component e.g Learn,
             * and pass the state (from parent component) as a prop (to each button)
             *
             */
            <MyButton/> 
        </div>
    )
    
}

/***
 * Moving state to parent component:
 *
 */
function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton1 count={count} onClick={handleClick} /> //declared as props in the Button1 component
      <MyButton1 count={count} onClick={handleClick} />
    </div>
  );
}

//The component arguments are called props, and should be
//passed when rendering the component (exactly the ssme name):
function MyButton1({ count, onClick }) {
    //count and onclick will be passed as props from the parent
    //component (just like normal attributes)
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}



//export default Learn
