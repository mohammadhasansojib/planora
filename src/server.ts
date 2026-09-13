import app from "./app/app.js";
import { config } from "./app/config/index.js";

const main = () => {
	const port = config.PORT || 5000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
};

main();
