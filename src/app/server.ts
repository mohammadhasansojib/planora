import app from "./app.js";
import { config } from "./config/index.js";

const main = () => {
	const port = config.PORT || 5000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
};

main();
