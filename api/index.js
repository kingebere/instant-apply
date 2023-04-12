const express = require("express");
const supabase = require("@supabase/supabase-js");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API ROUTES
app.get("/getUser", async (req, res) => {
	let supabaseUrl = "https://epcjufipobybxdmcqjgb.supabase.co";
	let supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY2p1Zmlwb2J5YnhkbWNxamdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIyMzU1MDksImV4cCI6MTk4NzgxMTUwOX0.MAZAUEozeDU7f6ZKwia0OMlJ8WnZFi-FCn-4cpAUCcE";

	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
	const token = req.headers["authorization"].split(" ")[1];

	const { data, error } = await supabaseClient.auth.getUser(token);

	if (data) {
		const { user } = data;
		const { data: dbdata, dberror } = await supabaseClient
			.from("profile")
			.select("firstName, lastName, email,phone,pdf,linkedin,github,website")
			.eq("id", user.id);
		res.status(200).json({
			data:dbdata[0],
		});
	}
});

const port = 8000;
app.listen(port, () => {
	console.log("listening on port " + port);
});
