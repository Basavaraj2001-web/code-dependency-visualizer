<!DOCTYPE html>
<html>
<head>
<title>Register - GLAMNAILS</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>
body{
    background:#000;
    color:white;
    font-family:'Inter',sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.card{
    background:#111;
    padding:40px;
    border-radius:15px;
    width:350px;
    border:1px solid #f8c0c0;
}

h2{
    text-align:center;
    margin-bottom:20px;
}

input{
    width:100%;
    padding:12px;
    margin:10px 0;
    background:#222;
    border:1px solid #444;
    color:white;
    border-radius:8px;
}

input:focus{
    outline:none;
    border:1px solid #f8c0c0;
}

button{
    width:100%;
    padding:12px;
    background:linear-gradient(90deg,#f8c0c0,#f1a7a7);
    border:none;
    border-radius:8px;
    font-weight:bold;
    cursor:pointer;
    margin-top:10px;
}

/* 🔥 THEMED LINK */
a{
    color:#f8c0c0;
    text-decoration:none;
    font-weight:500;
}

a:hover{
    text-decoration:underline;
    color:#f1a7a7;
}

p{
    text-align:center;
    margin-top:15px;
    font-size:14px;
}
</style>
</head>
<body>

<div class="card">
<h2>Create Account</h2>

<form onsubmit="return registerUser(event)">
<input type="text" required placeholder="Full Name">
<input type="email" required placeholder="Email">
<input type="password" required placeholder="Password">
<button type="submit">Register</button>
</form>

<p>
Already Registered? <a href="login.php">Login Here</a>
</p>

</div>

<script>
function registerUser(e){
    e.preventDefault();
    alert("Registration Successful! Please login.");
    window.location.href="login.php";
}
</script>

</body>
</html>
