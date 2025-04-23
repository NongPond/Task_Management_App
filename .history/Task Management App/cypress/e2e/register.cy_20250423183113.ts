describe('Register Page', () => {
  it('should display error when fields are empty', () => {
    // เข้าไปที่หน้า /register
    cy.visit('/register')

    // คลิกปุ่ม submit
    cy.get('button[type="submit"]').click()

    // เช็คว่า error message สำหรับอีเมล และรหัสผ่านแสดงขึ้นมา
    cy.contains('กรุณากรอกอีเมล')
    cy.contains('กรุณากรอกรหัสผ่าน')
  })

  it('should register successfully when valid input is given', () => {
    cy.visit('/register')

    // ใส่ข้อมูลลงในฟอร์ม
    cy.get('input[name="email"]').type('testuser@example.com')
    cy.get('input[name="password"]').type('password123')

    // คลิกปุ่ม submit
    cy.get('button[type="submit"]').click()

    // เช็คว่า redirect ไปที่หน้า Login หรือข้อความ success แสดง
    cy.url().should('include', '/login') // ตรวจสอบ URL
    cy.contains('สมัครสมาชิกสำเร็จ! กรุณา Login')
  })
})
