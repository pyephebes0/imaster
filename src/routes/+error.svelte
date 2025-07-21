<!-- src/routes/+error.svelte หรือหน้า 404 โดยเฉพาะ -->
<script>
  export let error;
</script>

<div class="container d-flex justify-content-center align-items-center vh-100">
  <div class="text-center" style="margin-top: -80px;">
    <img src="/404.png" alt="Logo" width="100%" class="mb-4" />
    <h1 class="display-4">404 - ไม่พบหน้านี้</h1>
    <p class="lead text-muted mb-4">
      ขอโทษค่ะ เราไม่พบหน้าที่คุณกำลังค้นหา
    </p>
    <a href="/" class="btn btn-primary">
      กลับหน้าแรก
    </a>
  </div>
</div>
