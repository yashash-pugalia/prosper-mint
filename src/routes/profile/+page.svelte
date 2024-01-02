<script>
  import { goto } from "$app/navigation";

  export let data;
</script>

<div class="grow flex flex-col items-center justify-center gap-y-4">
  <h4 class="text-xl font-bold">hello: {data.email}</h4>

  <div class="flex flex-row items-center gap-x-3">
    <a href="/auth/logout">logout</a>
    <button
      on:click={() => {
        fetch("/profile", {
          method: "DELETE",
        }).then(() => {
          goto("/");
        });
      }}>delete account</button
    >
  </div>
</div>
