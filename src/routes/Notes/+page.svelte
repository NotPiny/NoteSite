<script>
    import { browser } from '$app/environment';
    import { editJSON, readJSON } from '$lib/tools';
    import { onMount } from 'svelte';

    /**
     * @type {string | undefined}
     */
    let json = '';
    /**
     * @type {Array<{name: string, content: string, id: string}>}
    */
    let notes = [];

    onMount(async () => {
        json = await readJSON();
        notes = JSON.parse(json ?? '[{"name":"No notes","content":"Something went wrong while loading the notes","id":"abc"}]');
    });
</script>

<main>
    <h1>Notes</h1>
    <div class="list">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        {#each notes as note}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <article on:click={() => {
                if (browser) window.location.href = `/Notes/${note.id}`;
            }}>
                <span class="overlay"/>
                <h2>{note.name}</h2>
                <p>{note.content}</p>
            </article>
        {/each}
    </div>

    <button on:click={() => {
        if (browser) window.location.href = '/Notes/New';
    }} class="new">New note</button>
</main>

<style>
    .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    article {
        border: 3px solid #2f2f2f;
        border-radius: 1em;
        padding: 1rem;
        width: 10em;
        height: 10em;

        cursor: pointer;

        background: #2f2f2f;
        background: linear-gradient(180deg, #2f2f2f 0%, #131313 100%);
    }

    .new {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border: 3px solid #2f2f2f;
        border-radius: .45em;
        background: #2f2f2f;
        color: white;
        cursor: pointer;
    }
</style>