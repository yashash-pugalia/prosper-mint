<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="hero mt-32">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, dolor corporis distinctio
				consequatur fuga cumque ullam rerum. Natus nisi necessitatibus, dolorum minima labore
				expedita minus libero. Non odit nisi deleniti.
			</p>
		</div>
		<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<form class="card-body" on:submit|preventDefault={() => goto('/app')}>
				<div class="form-control">
					<label class="label" for="">
						<span class="label-text">Email</span>
					</label>
					<input type="email" placeholder="email" class="input input-bordered" required />
				</div>
				<div class="form-control">
					<label class="label" for="">
						<span class="label-text">Password</span>
					</label>
					<input type="password" placeholder="password" class="input input-bordered" required />
					<label class="label" for="">
						<a href="/#" class="label-text-alt link link-hover">Forgot password?</a>
					</label>
				</div>
				<div class="form-control mt-6">
					<button class="btn btn-primary">Login</button>
				</div>
			</form>
		</div>
	</div>
</div>
