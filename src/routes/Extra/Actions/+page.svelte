<script>
    import { browser } from "$app/environment";
    import { editJSON } from "$lib/tools";

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