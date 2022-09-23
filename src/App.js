import logo from './logo.svg';
import './App.css';
import styles from './Styles.module.sass'
import {Form} from "./form/form";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<div className={styles.Container}>
					<div className={styles.Promo}>
						<p className="App-link">Форма для заполнения</p>
						<img src={logo} className="App-logo" alt="logo"/>
						<a
							className="App-link"
							href="https://reactjs.org"
							target="_blank"
							rel="noopener noreferrer"
						>
							Learn React
						</a>
					</div>
					<div className={styles.LeftBox}>
						<Form/>
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
