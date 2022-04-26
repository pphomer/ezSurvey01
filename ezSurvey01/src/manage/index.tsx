import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom'
import { fetchManageSettings } from "../common/commonSlice";
import { useAppSettings } from "../common/useHooks/useAppSetting";
import { store } from "../Util/app/store";
import QNREdit from "./QNREdit";
import QNRList from "./QNRList";

export const App = () => {

	const { loaded } = useAppSettings(fetchManageSettings);
	if (!loaded) {
		// 等 AppSettings ready 才能繼續
		return <div> @@@@@ INIT APPSETTINGS LOADING @@@@@ </div>
	}

	return (
		<Router>
			<Switch>
				<Route exact path="/manage/" component={QNRList} />
				<Route exact path="/manage/edit/:qnrid?" component={QNREdit} />
				<Redirect to="/manage/" />
			</Switch>
		</Router>
	);
}


ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
