<template>
    <div>
        <h1>Artists</h1>
        
        <ul>
            <li v-for="(artist, index) in artists" :key="index">
                {{ artist.name }}
            </li>
        </ul>

        <hr>

        <label>Artist</label>
        <input type="text" v-model="newArtist" placeholder="Enter artist name">
        <button @click="addArtist">Add Artist</button>
    </div>
</template>

<script>
export default {
    name: "PageArtists",
    mounted() {
        this.fetchArtists();
    },
    data() {
        return {
            artists: [],
            newArtist: "",
            apiUrl: process.env.VUE_APP_BACKEND_API_URL || "/api"
        };
    },
    methods: {
    fetchArtists() {
        fetch(`${this.apiUrl}/api/artists`) // Add /api prefix here
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.artists = data;
                console.log("Fetched artists:", data);
            })
            .catch((error) => {
                console.error("Error fetching artists:", error);
            });
    },
    addArtist() {
        if (!this.newArtist.trim()) {
            console.warn("Artist name cannot be empty!");
            return;
        }

        fetch(`${this.apiUrl}/api/artists`, { // Add /api prefix here
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: this.newArtist,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                console.log(`Successfully added artist: ${this.newArtist}`);
                this.newArtist = ""; // Clear input field
                this.fetchArtists(); // Refresh artist list
            })
            .catch((error) => {
                console.error("Error adding artist:", error);
            });
    },
},

};
</script>
