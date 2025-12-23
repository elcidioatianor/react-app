import { createContext, useContext } from "react";

//1 - CRIAR CONTEXTO DE TEMA (COMPONENTE PARA PASSAR VALORES
//PARA CHILD COMPONENTS)
const ThemeContext = createContext("light"); //default value (or null)
//TEREMOS QUE ENVOLVER COM ELE QUALQUER ARVORE DE COMPONENTES
//QUE PRECISE DE INFORMAÇÕES SOBRE O TEMA

//2 - DEFINIR COMPONENTES QUE VAO USAR VALOR DO CONTEXTO
function Button() {
    //obter o tema a partir do ancestor (qualquer que passar essa informação)
    //chamada só válida no topo do componente filho
    const theme = useContext(ThemeContext);
    //retorna o valor do contexto, passado quer na criação do
    //contexto ou por qualquer ancestral do Button
}

//PARA PASSAR O CONTEXTO PARA Button,
//temos que envilvê-lo (ou a qualquer dos seus parentes)
//com o context provider correspondente:
function MyApp() {
    return (
        <ThemeContext value="dark">
            {" "}
            {/* Modificamos o valor do contexto */}
            <Form />
        </ThemeContext>
    );
}
//It doesn’t matter how many layers of components
//there are between the provider and the Button,
//When a Button anywhere inside of Form calls useContext(ThemeContext),
//it will receive "dark" as the value.

function Form() {
    //Renderiza Button's...
}

/* EXEMPLO COMPLETO */
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

//A COMPONENT CAN ONLY READ VALUES FROM COMPONENTS (CONTEXTS/PROVIDERS)
//ABOVE IT, NOT FROM ITSELF
function MyApp() {
    return (
        //ENVOLVEMOS O ELEMENTO OU O ANCESTRAL DO ELEMENTO QUE VAI LER O VALOR DO CONTEXTO
        <ThemeContext value="dark">
            <Form />
        </ThemeContext>
    );
}

function Form() {
    return (
        <Panel title="Welcome">
            <Button>Sign in</Button>
            <Button>Sign up</Button>
        </Panel>
    );
}

function Panel({ title, children }) {
    const theme = useContext(ThemeContext); //read theme from context
    const className = "panel-" + theme;

    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    );
}

function Button({ children }) {
    const theme = useContext(ThemeContext);
    const className = "btn-" + theme;

    return (<button className={className}>{children}</button>);
}

//ACTUALIZANDO VALORES DO CONTEXTO
//Basta combinar com 'state': declare uma variavel de state no componente parente,
//e passe o state actual abaixo como valor do contexto
function MyApp() {
    const [theme, setTheme] = useState("dark");

    return (
        <ThemeContext value={theme}>
            <Form />
            <Button onClick={() => setTheme("light")}>Change theme</Button>

            {/* OR VIA A CHECKBOX */}
            <label>
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={(e) =>
                        setTheme(e.target.checked ? "dark" : "light")
                    }
                />
                Use dark mode
            </label>
        </ThemeContext>
    );
}

//PODEMOS PASSAR QUALQUER VALOR COMO VALUE AO CONTEXT: FUNÇÃO, OBJETO, ARRAY, STRING, ETC
//E.G, PERMITIR QUE QUALQUER FILHA ALTERE O TEMA (NAO APENAS O PARENTE QUE CHAMA O CONTEXT),
//BASTA PASSAR AMBOS theme e setTheme COMO VALOR DO CONTEXTO,
//AS FILHAS LÊEM ESSES VALORES E USAM QUANDO NECESSÁRIO

//MÚLTIPLOS CONTEXTS INDEPENDENTES PODEM SER ANINHADOS
//BASTA CADA FILHA USAR O CONTEXTO APROPRIADO (O QUAL
//PRETENDE USAR O VALOR)
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
    const [theme, setTheme] = useState("light");
    const [currentUser, setCurrentUser] = useState(null);
    return (
        <ThemeContext value={theme}>
            <CurrentUserContext
                value={{
                    currentUser,
                    setCurrentUser,
                }}
            >
                <WelcomePanel />
                <label>
                    <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={(e) => {
                            setTheme(e.target.checked ? "dark" : "light");
                        }}
                    />
                    Use dark mode
                </label>
            </CurrentUserContext>
        </ThemeContext>
    );
}

function WelcomePanel({ children }) {
    const { currentUser } = useContext(CurrentUserContext);
    return (
        <Panel title="Welcome">
            {currentUser !== null ? <Greeting /> : <LoginForm />}
        </Panel>
    );
}

function Greeting() {
    const { currentUser } = useContext(CurrentUserContext);
    return <p>You logged in as {currentUser.name}.</p>;
}

function LoginForm() {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const canLogin = firstName.trim() !== "" && lastName.trim() !== "";
    return (
        <>
            <label>
                First name{": "}
                <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </label>
            <label>
                Last name{": "}
                <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>
            <Button
                disabled={!canLogin}
                onClick={() => {
                    setCurrentUser({
                        name: firstName + " " + lastName,
                    });
                }}
            >
                Log in
            </Button>
            {!canLogin && <i>Fill in both fields.</i>}
        </>
    );
}

function Panel({ title, children }) {
    const theme = useContext(ThemeContext);
    const className = "panel-" + theme;
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    );
}

function Button({ children, disabled, onClick }) {
    const theme = useContext(ThemeContext);
    const className = "button-" + theme;
    return (
        <button className={className} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}

//EXTRAINDO PROVIDERS PARA UM COMPONENTE:
//Aninhar contextos no app principal pode não ser
//atraente, a pesar de fornecer mais legibilidade ao código.
//Se dois contextos se aplicam a uma árvore de filhas,
//pode ser ideal encapsular ambos num componente:

//EN VEZ DE:
function MyApp() {
    const { theme, setTheme } = useContext(ThemeContext);
    return (
        <ThemeContext>
            <CurrentUserContext>//...</CurrentUserContext>
        </ThemeContext>
    );
}

//Podemos extrair ambos para um componente:
function MyApp() {
    const { theme, setTheme } = useState("light");

    return (
        <MyProvider theme={theme}>
            {" "}
            {/* PASSING IN PROPS EXAMPLE */}
            <WelcomePanel />
            <Button
                className={"button-" + theme}
                onClick={() => setTheme("dark")}
            >
                Use dark theme
            </Button>
        </MyProvider>
    );
}

function MyProvider({ theme, children }) {
    const { currentUser, setCurrentUser } = useState(null);

    return (
        <ThemeContext value={theme}>
            <CurrentUserContext value={{ currentUser, setCurrentUser }}>
                {children}
            </CurrentUserContext>
        </ThemeContext>
    );
}

//THIS DOES CONDITIONAL RENDERING USING CONTEXT VALUE
function WelcomePanel() {
    //Component que usa currentUser
    const { currentUser } = useContext(CurrentUserContext);

    return (
        <Panel title="Welcome">
            {currentUser !== null ? <Greeting /> : <LoginForm />}
        </Panel>
    );
}

function Greeting() {
    //THIS UPDATES UI USING THE CONTEXT VALUE
    const { currentUser } = useContext(/*...*/);

    return <p>You're logged in as {currentUser.firstName}!</p>;
}

function LoginForm() {
    //THIS SETS THE CURRENT USER USING THE CONTEXT VALUE
    const { setCurrentUser } = useContext(/*...*/);
    const { firstName, setFirstName } = useState("");
    let canLogin = firstName.trim() != "";

    return (
        <form>
            <label>FirstName{":"}</label>
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <Button
                disabled={!canLogin}
                onClick={setCurrentUser({ firstName })}
            >
                Log in
            </Button>

            {!canLogin && <p>Please fill in the field above</p>}
        </form>
    );
}

function Button({ disabled, onClick, children }) {
    const { theme } = useContext(ThemeContext);

    return (
        <button
            className={"button-" + theme}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function Panel({ title, children }) {
    let { theme } = useContext(ThemeContext); /*...*/

    return (
        <div className={"panel-" + theme}>
            <h1>{title}</h1>
            {children}
        </div>
    );
}
