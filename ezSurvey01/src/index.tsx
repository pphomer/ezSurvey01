import React from "react";
import ReactDOM from "react-dom";

export const App = () => {
	return (
		<h1> HIIIII </h1>
	)
}

ReactDOM.render(
	<React.StrictMode>
			<App />
	</React.StrictMode>,
	document.getElementById("root")
);
