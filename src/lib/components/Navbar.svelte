<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let user = null;
	export let onLogout = () => {};

	let dropdownOpen = false;

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown')) {
			dropdownOpen = false;
		}
	}

	onMount(() => {
		if (browser) {
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">iMaster</a>

		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav ms-auto">
				{#if user}
					<li class="nav-item">
						<a class="nav-link" href={`/profile/${user.id}`}>
							👤{user.username}
						</a>
					</li>
					<li class="nav-item">
						<button class="btn btn-link nav-link" on:click={onLogout}> Logout </button>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="/login">Login</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/signup">Sign Up</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<style>
	nav.custom-navbar {
		background: linear-gradient(90deg, #001f4d 0%, #000000 100%);
	}

	nav.custom-navbar .nav-link,
	nav.custom-navbar .navbar-brand {
		color: #a5d8ff;
	}

	nav.custom-navbar .nav-link:hover {
		color: #63a4ff;
	}

	nav.custom-navbar .dropdown-menu {
		background-color: #001f4d;
	}

	nav.custom-navbar .dropdown-item {
		color: #a5d8ff;
	}

	nav.custom-navbar .dropdown-item:hover {
		background-color: #002a6b;
		color: #ffffff;
	}

	.dropdown-menu {
		right: auto !important;
		left: 0 !important;
	}
</style>
