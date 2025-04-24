function Login() {
    const handleLogin = () => {
      // mock login
      localStorage.setItem('token', '1234');
      window.location.href = '/tasks';
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Login</h1>
        <button onClick={handleLogin} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    );
  }
  
  export default Login;
  