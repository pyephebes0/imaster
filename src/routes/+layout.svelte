<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Setting from '$lib/components/Setting.svelte';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	export let data;
	const user = data.user;

	// ตรวจสอบ path ปัจจุบัน (เช่น หน้าแรกคือ /)
	const isHomePage = derived(page, $page => $page.url.pathname === '/');

	async function handleLogout() {
		await fetch('/logout'); // ตาม endpoint จริง
		location.href = '/login'; // fallback client redirect
	}
</script>

<Navbar {user} onLogout={handleLogout} />

<main class="d-flex flex-column min-vh-100">
  <div class="flex-grow-1">
		{#if user}
			{#if $isHomePage}
				<Setting />
			{:else}
				<!-- แสดงเนื้อหาปกติของแต่ละ route -->
				<slot />
			{/if}
		{:else}
			<!-- ถ้ายังไม่ login แสดงเนื้อหาปกติ -->
			<slot />
		{/if}
  </div>

  <footer class="bg-light text-center text-muted py-3 border-top">
    <div class="container">
      <small>© {new Date().getFullYear()} iMaster. All rights reserved.</small>
    </div>
  </footer>
</main>
