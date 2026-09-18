import app from "./src/server"

function main() {
    app.listen(5000, () => console.log("Server running at port 5000..."));
}

main();