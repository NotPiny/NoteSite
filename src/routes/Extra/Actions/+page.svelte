<script>
    import { browser } from "$app/environment";
    import { editJSON, readJSON } from "$lib/tools";

    async function deleteAllNotes() {
        if (!browser) return;
        if (!confirm("Are you sure you want to delete all notes?")) return;
        
        editJSON([]);
        alert("All notes have been deleted.");
    }
</script>

<main>
    <h1>
        Actions
    </h1>
    <p>
        This page can be used to perform actions such as deleting all notes.
    </p>
    
    <button on:click={()=>{deleteAllNotes()}}>
        Delete all notes
    </button>

    <button on:click={async()=>{
        if (!browser) return;
        sessionStorage.removeItem('n'); // If this is missing the notes will be fetched from the api
        alert("Cache has been cleared.");
    }}>
        Clear cache
    </button>
</main>

<style>
    button {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #3f3f3f;

        background-color: #2f2f2f;
        color: white;
    }
</style>