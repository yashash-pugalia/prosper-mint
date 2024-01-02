<script lang="ts">
  export let form;
</script>

<p>Example Signup</p>

<p>Showcasing how to use the signup in SvelteKit with Lucia</p>

<form class="flex flex-col gap-y-4" method="POST">
  <div class="flex flex-col w-full gap-1.5">
    <label for="email">email</label>
    <input type="email" id="email" placeholder="email" name="email" required />
  </div>

  <div class="flex flex-col w-full gap-1.5">
    <label for="firstName">first name</label>
    <input
      type="text"
      id="firstName"
      placeholder="first name"
      name="firstName"
    />
  </div>

  <div class="flex flex-col w-full gap-1.5">
    <label for="lastName">last name</label>
    <input type="text" id="lastName" placeholder="last name" name="lastName" />
  </div>

  <div class="flex flex-col w-full gap-1.5">
    <label for="password">password</label>
    <input
      type="password"
      id="password"
      placeholder="password"
      name="password"
      required
    />
  </div>

  <div class="flex flex-col w-full gap-1.5">
    <label for="confirmPassword">password</label>
    <input
      type="password"
      id="confirmPassword"
      placeholder="confirm password"
      name="confirmPassword"
      required
    />
  </div>

  {#if form?.message}
    <span class="text-sm font-light text-red-600">{form?.message}</span>
  {/if}

  <div class="flex flex-row justify-center items-center w-full gap-1.5">
    <button type="submit" class="bg-blue-800 dark:text-white hover:text-black">
      Sign Up with Email
    </button>
  </div>
</form>

<a class="btn" href="/auth/login">login</a>
