<script>
  import { onMount } from 'svelte';
  let accounts = [];

  async function fetchAccounts() {
    try {
      const res = await fetch('https://imaster-server.onrender.com/twitter/accounts', {
        credentials: 'include',
      });
      if (res.ok) {
        accounts = await res.json();
      } else {
        accounts = [];
      }
    } catch {
      accounts = [];
    }
  }

  function connectTwitter() {
    window.location.href = 'https://imaster-server.onrender.com/twitter/auth';
  }

  async function revokeAccount(twitterUserId) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการเชื่อมบัญชีนี้?')) return;

    try {
      const res = await fetch(`https://imaster-server.onrender.com/twitter/account/${twitterUserId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok || res.status === 204) {
        accounts = accounts.filter((acc) => acc.twitterUserId !== twitterUserId);
      } else {
        alert('ลบบัญชีไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    }
  }

  onMount(() => {
    fetchAccounts();
  });
</script>

<style>
  div.container {
    max-width: 400px; /* ปรับความกว้าง container */
  }
  ul.list-group li.list-group-item {
    max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button.btn-sm {
    width: 60px;
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }
</style>

<div class="container py-5">
  <h1 class="mb-4">เชื่อมบัญชี Twitter</h1>

  <button class="btn btn-primary mb-4" on:click={connectTwitter}>
    <i class="bi bi-twitter me-2"></i> เชื่อมบัญชี Twitter ใหม่
  </button>

  <h2 class="h4">บัญชีที่เชื่อมไว้</h2>
  <ul class="list-group">
    {#if accounts.length === 0}
      <li class="list-group-item text-muted">ยังไม่มีบัญชีที่เชื่อมไว้</li>
    {/if}
    {#each accounts as acc}
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>@{acc.username}</span>
        <div>
          <span class="badge bg-success me-2">เชื่อมแล้ว</span>
          <button class="btn btn-sm btn-outline-danger" on:click={() => revokeAccount(acc.twitterUserId)}>
            ยกเลิก
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>