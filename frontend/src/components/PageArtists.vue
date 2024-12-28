<template>
    <div>
        <h1>
            Artists
        </h1>
        
        <ul>
            <li v-for="(artist, index) in artists" :key="index">
                {{ artist.name }}
            </li>
        </ul>

        <hr>

        <label> Artist </label>
        <input type="text" v-model="newArtist">
        <button @click="addArtist()">
            Add artists
        </button>
    </div>
</template>

<script>
    export default {
        name: 'PageArtists',
        mounted() {
            this.fetchArtists();
        },
        data() {
            return {
                artists: [],
                newArtist: "",
                apiUrl: process.env.VUE_APP_BACKEND_API_URL || "/api"
            }
        },
        methods: {
            fetchArtists() {
                fetch(`${this.apiUrl}/artists`)
                .then(response => response.json())
                    .then(data => {
                        this.artists = data;
                    })
            },
            addArtist() {
                fetch(`${this.apiUrl}/artists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: this.newArtist
                    })
                })
                    .then(response => response.json())
                    .then(() => {
                        this.fetchArtists();
                    })
                console.log("Add artist:" + this.newArtist);
            }
        }
    }
</script>
