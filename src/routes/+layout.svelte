<script lang="ts">
	import '../app.postcss';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="max-w-screen-xl p-4 w-full mx-auto">
	<div class="border-b -mx-4 -mt-4 p-1 px-4 flex justify-between items-center">
		<a class="text-lg font-semibold" href="/">Prosper Mint</a>
		<div class="flex">
			<Button variant="link">Team</Button>
			<Button variant="link">Manifest</Button>
			<Button variant="link">Blog</Button>
			<Button variant="link">Privacy</Button>
		</div>
	</div>
	<slot />
</div>
