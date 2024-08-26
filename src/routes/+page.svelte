<svelte:head>
    <title>Unlock Notes</title>
    
    <!-- Embed metadata -->
    <meta name="description" content="Unlock Notes" />

    <!-- General metadata -->
    <meta name="author" content="Piny (piny.dev)" />
    <meta name="language" content="English" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    onMount(() => {
        if (sessionStorage.getItem("p") && localStorage.getItem("token") && localStorage.getItem("message")) {
            window.location.href = '/Notes';
        }
    })

    let password = "";

    async function submit() {
        if (password === "") {
            alert("Please enter the password.");
            return;
        }

        if (browser) {
            sessionStorage.setItem("p", password);

            if (!localStorage.getItem("token") || !localStorage.getItem("message")) {
                window.location.href = '/Extra/Info'
            } else {
                window.location.href = '/Notes';
            }
        }
    }
</script>

<main>
    <h1>
        Unlock Notes
    </h1>
    <p>
        The page you are trying to access is locked. Please enter the password to unlock it.
    </p>
    
    <form on:submit|preventDefault={submit}>
        <input type="password" id="password" bind:value={password} /><br/>
        <button type="submit">
            Unlock
        </button>
    </form>
</main>

<style>
    input {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #3f3f3f;

        background-color: #2f2f2f;
        color: white;
    }

    button {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #3f3f3f;

        background-color: #2f2f2f;
        color: white;
    }
</style>