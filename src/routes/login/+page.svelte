<script>
  import { onMount } from 'svelte';

  let username = '';
  let password = '';
  let loading = false;
  let error = '';

  async function login() {
    if (loading) return;
    error = '';
    loading = true;

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        location.href = `/profile/${data.userId}`;
      } else {
        const text = await res.text();
        error = text || 'Login failed. Please try again.';
      }
    } catch (e) {
      error = 'Network error: ' + e.message;
    } finally {
      loading = false;
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    login();
  }

  let usernameInput;
  onMount(() => {
    usernameInput?.focus();
  });
</script>

<svelte:head>
  <title>เข้าสู่ระบบ - iMaster</title>
  <meta name="description" content="เข้าสู่ระบบเพื่อจัดการโปรแกรมโพสต์ออโต้ Twitter ของคุณ" />
</svelte:head>

<div class="container mt-5" style="max-width: 400px;">
  <h2>Login</h2>
  <form on:submit={onSubmit} novalidate>
    <div class="mb-3">
      <label class="form-label" for="username">Username</label>
      <input
        id="username"
        class="form-control"
        bind:this={usernameInput}
        bind:value={username}
        required
        autocomplete="username"
      />
    </div>
    <div class="mb-3">
      <label class="form-label" for="password">Password</label>
      <input
        id="password"
        type="password"
        class="form-control"
        bind:value={password}
        required
        autocomplete="current-password"
      />
    </div>

    {#if error}
      <div class="alert alert-danger" role="alert">
        {error}
      </div>
    {/if}

    <button class="btn btn-primary w-100" type="submit" disabled={loading}>
      {#if loading}Logging in...{:else}Login{/if}
    </button>

    <!-- ลิงก์สมัครสมาชิกและดูแพ็กเกจราคา -->
    <div class="text-center mt-3">
      <small>ยังไม่มีบัญชี? <a href="/signup">สมัครสมาชิก</a></small><br />
      <small>หรือ <a href="/pricing">ดูแพ็กเกจราคา</a> ก่อนเข้าสู่ระบบ</small>
    </div>
  </form>
</div>
