<main>
  <h1>ยินดีต้อนรับสู่ iMaster</h1>
  <p>โปรแกรมโพสต์ออโต้ Twitter ที่ช่วยให้คุณจัดการโพสต์ได้ง่ายและรวดเร็ว</p>
  <div class="d-flex flex-column align-items-center gap-2 mt-3">
    <a href="/signup" class="btn btn-primary">เริ่มใช้งานเลย</a>
    <a href="/pricing" class="btn btn-outline-secondary">ดูแพ็กเกจราคา</a>
  </div>
</main>

<style>
  main {
    max-width: 600px;
    margin: 5rem auto 3rem; /* top 5rem, auto left/right, bottom 3rem */
    padding: 2.5rem 2rem;
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1e293b;
    background-color: #f0f4ff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgb(37 99 235 / 0.2);
    /* ทำให้ main อยู่บนเลเยอร์ที่สูงขึ้น ถ้ามี navbar ซ้อน */
    position: relative;
    z-index: 10;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: #2563eb;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
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
  }
  a.button:hover {
    background-color: #1e40af;
  }
</style>
