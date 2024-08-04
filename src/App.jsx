import { BrowserRouter } from "react-router-dom";
import { List, Navbar, End } from "./components";

const App = () => {
	return (
		<BrowserRouter>
			<div className="relative z-0 bg min-h-500">
				<Navbar/>
				<List />
				<End />
			</div>
		</BrowserRouter>
	);
};

export default App;
