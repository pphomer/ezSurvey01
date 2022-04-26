import React from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom'


import { store } from "../Util/app/store";
import { Provider } from 'react-redux';
import "./exam.css"
import { ExamForm } from "./ExamForm";
import { restoreScrollY } from "../common/commonUtils";
import { useAppSettings } from "../common/useHooks/useAppSetting";
import ExamList from "./ExamList";

restoreScrollY(location.pathname);

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/exam/:qnrid/list" component={ExamList} />
				<Route exact path="/exam/:qnrid/:examid?" component={ExamForm} />
				<Redirect to="/manage/" />
			</Switch>
		</Router>
	)
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
