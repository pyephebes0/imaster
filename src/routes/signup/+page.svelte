<script>
	let username = '';
	let email = '';
	let password = '';
	let confirm = '';
	let error = '';
	let loading = false;

	async function signup(event) {
		event.preventDefault();
		error = '';

    // ✅ ตรวจสอบว่าทุกช่องถูกกรอก
		if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
			error = 'Please fill in all fields.';
			return;
		}

		if (password !== confirm) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password, confirm })
			});

			if (res.ok) {
				alert('Signup successful! Please login.');
				location.href = '/login';
			} else {
				const text = await res.text();
				error = text || 'Signup failed.';
			}
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mt-5" style="max-width: 400px;">
	<h2>Sign Up</h2>
	<form on:submit={signup} novalidate>
		<div class="mb-3">
			<label class="form-label" for="username">Username</label>
			<input id="username" class="form-control" bind:value={username} required />
		</div>

		<div class="mb-3">
			<label class="form-label" for="email">Email</label>
			<input id="email" type="email" class="form-control" bind:value={email} required />
		</div>

		<div class="mb-3">
			<label class="form-label" for="password">Password</label>
			<input id="password" type="password" class="form-control" bind:value={password} required />
		</div>

		<div class="mb-3">
			<label class="form-label" for="confirm">Confirm Password</label>
			<input id="confirm" type="password" class="form-control" bind:value={confirm} required />
		</div>

		{#if error}
			<div class="alert alert-danger" role="alert">{error}</div>
		{/if}

		<button class="btn btn-success w-100" type="submit" disabled={loading}>
			{#if loading}Signing up...{:else}Sign Up{/if}
		</button>
	</form>
</div>
