const express = require("express");
const app = express();
require("./models/db");
const userRoute = require("./routes/user");

app.use(express.json());
app.use(express.static("src/views"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/register.html");
});


app.use("/", userRoute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
