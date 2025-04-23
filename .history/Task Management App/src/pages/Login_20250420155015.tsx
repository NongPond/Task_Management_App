function Login() {
    const handleLogin = () => {
      localStorage.setItem('token', '1234'); // mock token
      window.location.href = '/tasks';
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Login</h1>
        <input placeholder="Email" className="block my-2 p-2 border rounded" />
        <input placeholder="Password" type="password" className="block my-2 p-2 border rounded" />
        <button onClick={handleLogin} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    );
  }
  
  export default Login;
  