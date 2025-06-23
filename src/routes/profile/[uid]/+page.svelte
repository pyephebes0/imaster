<script>
  export let data;
  const user = data.user;

  async function logout() {
    await fetch('/logout');
  }
</script>

<style>
  main {
    max-width: 600px;
    margin: 5rem auto 3rem;
    padding: 2.5rem 2rem;
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1e293b;
    background-color: #f0f4ff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgb(37 99 235 / 0.2);
    position: relative;
    z-index: 10;
  }

  h1, h3 {
    color: #2563eb;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 2rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  a.button {
    display: inline-block;
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s ease;
    width: 100%;
    margin-bottom: 2rem;
  }
  a.button:hover {
    background-color: #1e40af;
  }

  a.logout {
    display: inline-block;
    background-color: transparent;
    color: #dc2626;
    border: 2px solid #dc2626;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    text-decoration: none;
    transition: background-color 0.3s ease, color 0.3s ease;
    width: 100%;
    margin-top: 1rem;
  }
  a.logout:hover {
    background-color: #dc2626;
    color: white;
  }
</style>

<svelte:head>
  <title>โปรไฟล์ผู้ใช้ - iMaster</title>
  <meta name="description" content="ดูข้อมูลโปรไฟล์และสถานะแพ็กเกจเครดิตของคุณใน iMaster" />
</svelte:head>

<main>
  <a href="/" class="button">
    🏠 เริ่มใช้งานเลย!!
  </a>

  <h3>👤 Profile</h3>
  <p><strong>Username:</strong> {user.username}</p>
  <p><strong>Email:</strong> {user.email}</p>

  <!-- ลิงก์ไปหน้าแพ็กเกจราคา -->
  <a href="/pricing" class="btn btn-info my-3 d-inline-block">
    💳 ซื้อแพ็กเกจเครดิต
  </a>

  <br />

  <a href="/logout" class="logout">Logout</a>
</main>

