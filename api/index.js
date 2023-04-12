const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv").config();

const supabaseUrl = process.env.URL;
const supabaseKey = process.env.KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json());

//API ROUTES 
app.get('/getUser', (req, res) => {
    

})


const port = 3000;
app.listen(port, () => {
	console.log("listening on port " + port);
});
