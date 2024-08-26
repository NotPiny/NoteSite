<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let token = "";
    let message = "";
    let channel = "";

    async function submit() {
        if (token === "" || message === "" || channel === "") {
            alert("Please enter required fields.");
            return;
        }

        if (browser) {
            localStorage.setItem("token", token);
            localStorage.setItem("message", message);
            localStorage.setItem("channel", channel);

            window.location.href = '/'
        }
    }

    onMount(() => {
        token = localStorage.getItem("token") || "";
        message = localStorage.getItem("message") || "";
        channel = localStorage.getItem("channel") || "";
    });
</script>

<main>
    <h1>
        Extra Info
    </h1>
    <p>
        Please enter the token and message to unlock the page.<br/>
        (You will only need to do this once.)
    </p>
    
    <form on:submit|preventDefault={submit}>
        <input type="text" id="token" bind:value={token} placeholder="Token" required/><br/>
        <input type="text" id="message" bind:value={message} placeholder="Message" required/><br/>
        <input type="text" id="channel" bind:value={channel} placeholder="Channel" required/><br/>
        <button type="submit">
            Save
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