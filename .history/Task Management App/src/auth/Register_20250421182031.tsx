const handleRegister = async () => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const isExisting = existingUsers.some((user: any) => user.email === email);
    if (isExisting) {
      alert("อีเมลนี้ถูกใช้ไปแล้ว");
      return;
    }

    // 👇 ส่งไป backend ด้วย fetch
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ! กรุณา Login");
      navigate("/");
    } else {
      alert(data.message || "เกิดข้อผิดพลาด");
    }
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถสมัครสมาชิกได้");
  }
};




