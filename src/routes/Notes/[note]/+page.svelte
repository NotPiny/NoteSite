<script>
    import { browser } from "$app/environment";
    import { editJSON, readJSON } from "$lib/tools";
    import { onMount } from "svelte";
    import SvelteMarkdown from "svelte-markdown";
    export let data;
    const noteId = data.note;
    /**
     * @type {Array<{name: string, content: string, id: string}>}
     */
    let notes = [];
    let note = {
        name: "No notes",
        content: "Please wait while the notes are being loaded...",
        id: noteId
    };
    let content = note.content;
    $: { content = contentInput; }
    let contentInput = content;

    onMount(async() => {
        notes = JSON.parse(await readJSON() ?? `[{"name":"No notes","content":"Something went wrong while loading the notes","id":"${noteId}"}]`); // Override the missing note with the error message
        note = notes.find((/** @type {{ id: string; }} */ n) => n.id === noteId) ?? note;
        contentInput = note.content;
    })
</script>

<main>
    <h1>{note.name}</h1>
    <span>
        <SvelteMarkdown 
        source={content}
        options={
            {
                gfm: true,
                breaks: true
            }
        }
        />
    </span>
    <textarea bind:value={contentInput} class="boxed" style="height: 100%;"/>
    <div class="actions">
        <button on:click={async() => {
            if (!browser) return;
            if (!confirm("Are you sure you want to delete this note?")) return;

            await editJSON(notes.filter((/** @type {{ id: string; }} */ n) => n.id !== noteId));
            window.location.href = "/Notes";
        }}>Delete note</button>
        <button on:click={async() => {
            if (!browser) return;

            const index = notes.findIndex((/** @type {{ id: string; }} */ n) => n.id === noteId);
            notes[index].content = contentInput;
            await editJSON(notes);
            alert("Note has been saved.");
        }}>Save note</button>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    h1 {
        font-size: 2rem;
    }

    .boxed {
        width: 100%;
        min-height: 50vh;
        resize: vertical;
        padding: 1rem;
        border: 3px solid #2f2f2f;
        border-radius: 1em;
        background: #2f2f2f;
        color: white;
        font-size: 1rem;
    }

    .actions {
        display: flex;
        gap: .25rem;
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