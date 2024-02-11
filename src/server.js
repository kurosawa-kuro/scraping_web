const { app } = require("./app");

const port = process.env.PORT || 3000;

// Server Initialization
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
