const dbname = path.join(__dirname, "data", "bizmaven.db");
const db = new sqlite3.Database(dbname, (err)=>{
    if(err) return console.log(err);
    console.log("Database Connected")
});
