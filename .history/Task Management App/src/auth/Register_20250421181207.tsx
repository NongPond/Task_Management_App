const handleRegister = async () => {
  if (!email || !password) {
    alert("กรุณากรอกอีเมลและรหัสผ่าน");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/register", {
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
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
};



