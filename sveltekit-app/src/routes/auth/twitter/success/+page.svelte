<script>
  import { onMount } from 'svelte';

  onMount(() => {
    setTimeout(() => {
      window.location.href = '/';
    }, 3000); // 3 วินาที
  });
</script>

<!-- Container + Margin top เพื่อขยับ card ลงจาก navbar -->
<div class="container mt-5 d-flex justify-content-center">
  <div class="card text-center shadow-lg p-4" style="max-width: 500px; width: 100%;">
    <div class="card-body">
      <h3 class="card-title text-success">✅ เชื่อมบัญชี Twitter สำเร็จ!</h3>
      <p class="card-text mt-3">
        ระบบกำลังพาคุณกลับไปยังหน้าเชื่อมบัญชี...
      </p>
      <div class="d-flex justify-content-center mt-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</div>
