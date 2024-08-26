<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { generateId, editJSON, readJSON } from "$lib/tools";

    let name = "";
    let content = "";

    let ready = false;
    /**
     * @type {Array<{name: string, content: string, id: string}>}
     */
    let notes = [];

    onMount(async () => {
        let json = await readJSON();
        notes = JSON.parse(json ?? '[{"name":"No notes","content":"Something went wrong while loading the notes","id":"abc"}]');
        ready = true;
    });

    async function submit() {
        if (!browser) return;
        if (name === "" || content === "") return alert("Please enter required fields.");
        if (!ready) return alert("Please wait for the current notes to load.");

        notes.push({ name, content, id: await generateId() });
        await editJSON(notes); // Save the new note

        window.location.href = "/Notes";
    }
</script>

<main>
    <h1>
        Create a new note
    </h1>
    
    <form on:submit|preventDefault={submit}>
        <input type="text" class="input" id="name" bind:value={name} placeholder="Name" required/><br/>
        <textarea id="content" class="input" bind:value={content} placeholder="Content" required/><br/>
        <button type="submit">
            Create
        </button>
    </form>
</main>

<style>
    .input {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #3f3f3f;

        width: 90%;

        background-color: #2f2f2f;
        color: white;
    }

    textarea {
        height: 10em;
        min-height: 5em;

        resize: vertical;
    }

    input {
        height: 2em;
    }

    button {
        padding: 15px;
        font-size: large;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #3f3f3f;

        background-color: #2f2f2f;
        color: white;
    }
</style>