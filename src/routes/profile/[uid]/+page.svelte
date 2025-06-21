<script>
  export let data;
  const user = data.user;

  async function logout() {
    await fetch('/logout');
  }
</script>

<div class="container mt-4" style="max-width: 400px;">
  <a href="/" class="btn btn-outline-primary btn-lg btn-block w-100 mb-5">
    🏠 เริ่มใช้งานเลย!!
  </a>

  <h3 class="mb-3">👤 Profile</h3>
  <p class="mb-1"><strong>Username:</strong> {user.username}</p>
  <p class="mb-1"><strong>Email:</strong> {user.email}</p>

  <a href="/logout" class="btn btn-outline-danger btn-sm mt-4 w-100">Logout</a>
</div>
