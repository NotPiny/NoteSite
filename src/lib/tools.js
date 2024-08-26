import { browser } from "$app/environment";

let data = {
    token: '',
    message: '',
    channel: '',
    key: ''
}

if (browser && (!localStorage.getItem('token') || !localStorage.getItem('message') || !localStorage.getItem('channel') || !sessionStorage.getItem('p'))) location.href = '/';

// We now have access to all required data
if (browser) {
    data.token = localStorage.getItem('token') ?? ''
    data.message = localStorage.getItem('message') ?? ''
    data.channel = localStorage.getItem('channel') ?? ''
    data.key = sessionStorage.getItem('p') ?? ''
}


/**
 * Encrypts the given text using the provided password.
 * @param {string} text - The text to be encrypted.
 * @param {string} password - The password used for encryption.
 * @returns {Promise<{ salt: any, iv: any, data: any }>} - A promise that resolves to an object containing the encrypted data, initialization vector (iv), and salt.
*/
async function encrypt(text, password) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw', 
        encoder.encode(password), 
        { name: 'PBKDF2' }, 
        false, 
        ['deriveKey']
    );
    
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        false,
        ['encrypt']
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        key,
        encoder.encode(text)
    );
    
    return {
        iv: Array.from(iv),
        salt: Array.from(salt),
        data: Array.from(new Uint8Array(encrypted))
    };
}


/**
 * Decrypts the given encrypted data using the provided password.
 * @param {{ salt: any, iv: any, data: any }} encryptedData - The encrypted data to be decrypted.
 * @param {string} password - The password used for decryption.
 * @returns {Promise<string>} - A promise that resolves to the decrypted data as a string.
*/
async function decrypt(encryptedData, password) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const salt = new Uint8Array(encryptedData.salt);
    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
    );

    const iv = new Uint8Array(encryptedData.iv);
    const encryptedArray = new Uint8Array(encryptedData.data);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        key,
        encryptedArray
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

export async function readJSON() {
    if (browser) {
        if (sessionStorage.getItem('n')) return await decrypt(JSON.parse(sessionStorage.getItem('n') ?? ''), data.key); // Don't fetch the message if we already have it
        // Get message
        const messageReq = await fetch(`/api/discord/messages?channel=${encodeURIComponent(data.channel)}&msg=${encodeURIComponent(data.message)}`, {
            headers: {
                'Authorization': `Bot ${data.token}`
            }
        })
    
        // Get message JSON
        const messageJSON = await messageReq.json()

        // Get message content
        const messageContent = messageJSON.content
        sessionStorage.setItem('n', messageContent) // Save the message for later use

        // Decrypt message
        try {
            const decrypted = await decrypt(JSON.parse(messageContent), data.key)
            return decrypted
        } catch(e) {
            const option = confirm('The message could not be decrypted. Would you like to try some actions to fix this?')
            if (option) {
                location.href = '/Extra/Actions' // Redirect to the actions page for wiping the data or whatever
            }
        }
    }
}

/**
 * @param {any} content 
*/
export async function editJSON(content) {
    if (!browser) return;

    // Check if the message is a string or an object
    const message = typeof content === 'string' ? content : JSON.stringify(content)

    // Encrypt message
    const encrypted = await encrypt(message, data.key)

    // Edit message
    await fetch(`/api/discord/messages?channel=${encodeURIComponent(data.channel)}&msg=${encodeURIComponent(data.message)}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bot ${data.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: JSON.stringify(encrypted)
        })
    })

    // Remove the cached message
    sessionStorage.getItem('n') && sessionStorage.removeItem('n')
}

export async function generateId(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result;
}